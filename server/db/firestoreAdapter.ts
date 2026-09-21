import admin from 'firebase-admin';
import { getFirestore, isFirebaseActive } from './firebase';

export interface QueryOptions {
  sort?: Record<string, 1 | -1>;
  limit?: number;
  skip?: number;
}

function matchesInMemory(item: any, query: any): boolean {
  if (!query || Object.keys(query).length === 0) return true;

  for (const key of Object.keys(query)) {
    const val = query[key];

    if (key === '$or' && Array.isArray(val)) {
      const matchAny = val.some(sub => matchesInMemory(item, sub));
      if (!matchAny) return false;
      continue;
    }

    if (key === '$and' && Array.isArray(val)) {
      const matchAll = val.every(sub => matchesInMemory(item, sub));
      if (!matchAll) return false;
      continue;
    }

    const itemVal = item[key];

    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof RegExp)) {
      if ('$in' in val && Array.isArray(val.$in)) {
        if (!val.$in.some((v: any) => String(v) === String(itemVal))) return false;
        continue;
      }
      if ('$gte' in val) {
        if (itemVal < val.$gte) return false;
        continue;
      }
      if ('$lte' in val) {
        if (itemVal > val.$lte) return false;
        continue;
      }
      if ('$ne' in val) {
        if (String(itemVal) === String(val.$ne)) return false;
        continue;
      }
      if ('$regex' in val) {
        const regex = new RegExp(val.$regex, val.$options || 'i');
        if (!regex.test(String(itemVal || ''))) return false;
        continue;
      }
    }

    if (val instanceof RegExp) {
      if (!val.test(String(itemVal || ''))) return false;
      continue;
    }

    // Direct comparison
    if (String(itemVal ?? '').toLowerCase() !== String(val ?? '').toLowerCase()) {
      return false;
    }
  }

  return true;
}

export class FirestoreQueryChain<T = any> implements PromiseLike<T[]> {
  private _collection: FirestoreCollection<T>;
  private _query: any;
  private _sort?: Record<string, 1 | -1>;
  private _limit?: number;
  private _skip?: number;

  constructor(collection: FirestoreCollection<T>, query: any = {}) {
    this._collection = collection;
    this._query = query;
  }

  sort(sortObj: Record<string, 1 | -1> | string) {
    if (typeof sortObj === 'string') {
      const parts = sortObj.split(' ');
      const obj: Record<string, 1 | -1> = {};
      for (const p of parts) {
        if (p.startsWith('-')) obj[p.slice(1)] = -1;
        else obj[p] = 1;
      }
      this._sort = obj;
    } else {
      this._sort = sortObj;
    }
    return this;
  }

  limit(n: number) {
    this._limit = n;
    return this;
  }

  skip(n: number) {
    this._skip = n;
    return this;
  }

  select(_fields: any) {
    return this;
  }

  populate(_field: any) {
    return this;
  }

  private async execute(): Promise<T[]> {
    const rawItems = await this._collection.fetchRaw(this._query);

    let items = rawItems.filter(it => matchesInMemory(it, this._query));

    if (this._sort) {
      const [field, order] = Object.entries(this._sort)[0] || [];
      if (field) {
        items.sort((a: any, b: any) => {
          const valA = a[field];
          const valB = b[field];
          if (valA === valB) return 0;
          if (valA === undefined) return 1;
          if (valB === undefined) return -1;
          if (order === -1) {
            return valA < valB ? 1 : -1;
          }
          return valA > valB ? 1 : -1;
        });
      }
    }

    if (typeof this._skip === 'number') {
      items = items.slice(this._skip);
    }
    if (typeof this._limit === 'number') {
      items = items.slice(0, this._limit);
    }

    return items.map(it => this._collection.wrap(it));
  }

  then<TResult1 = T[], TResult2 = never>(
    onfulfilled?: ((value: T[]) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export class FirestoreCollection<T = any> {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  private get colRef(): admin.firestore.CollectionReference {
    return getFirestore().collection(this.name);
  }

  public wrap(docData: any): any {
    if (!docData) return null;
    const self = this;
    const docId = docData._id || docData.id;
    const wrapped = { ...docData, _id: docId, id: docId };

    Object.defineProperty(wrapped, 'save', {
      enumerable: false,
      value: async function () {
        wrapped.updatedAt = new Date().toISOString();
        const idToSave = String(wrapped._id || wrapped.id);
        const { _id, id, ...payload } = wrapped;
        await self.colRef.doc(idToSave).set(payload, { merge: true });
        return wrapped;
      },
    });

    Object.defineProperty(wrapped, 'toObject', {
      enumerable: false,
      value: function () {
        return { ...wrapped };
      },
    });

    Object.defineProperty(wrapped, 'toJSON', {
      enumerable: false,
      value: function () {
        return { ...wrapped };
      },
    });

    return wrapped;
  }

  public async fetchRaw(query: any = {}): Promise<any[]> {
    if (!isFirebaseActive()) return [];

    try {
      const keys = Object.keys(query || {});
      // Optimize single simple equality queries to native Firestore where clause
      if (keys.length === 1 && typeof query[keys[0]] !== 'object' && !keys[0].startsWith('$')) {
        const field = keys[0];
        const val = query[field];
        const snapshot = await this.colRef.where(field, '==', val).get();
        return snapshot.docs.map(doc => {
          const data = doc.data();
          const docId = doc.id;
          return { ...data, _id: data._id || docId, id: docId };
        });
      }

      // Default: fetch collection docs and filter in memory
      const snapshot = await this.colRef.get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        const docId = doc.id;
        return { ...data, _id: data._id || docId, id: docId };
      });
    } catch (err: any) {
      console.error(`[FirestoreCollection:${this.name}] fetch error:`, err.message || err);
      return [];
    }
  }

  find(query: any = {}) {
    return new FirestoreQueryChain<T>(this, query);
  }

  async findOne(query: any = {}) {
    const results = await this.find(query).limit(1);
    return results.length > 0 ? results[0] : null;
  }

  async findById(id: any) {
    if (!id) return null;
    const strId = String(id);

    try {
      const doc = await this.colRef.doc(strId).get();
      if (doc.exists) {
        const data = doc.data()!;
        return this.wrap({ ...data, _id: doc.id, id: doc.id });
      }

      // If document not found by doc.id, check if stored with _id matching strId
      const byField = await this.findOne({ _id: strId });
      return byField;
    } catch (err: any) {
      console.error(`[FirestoreCollection:${this.name}] findById error:`, err.message || err);
      return null;
    }
  }

  async create(data: any) {
    const docData = { ...data };
    const now = new Date().toISOString();
    if (!docData.createdAt) docData.createdAt = now;
    if (!docData.updatedAt) docData.updatedAt = now;

    let docId = docData._id ? String(docData._id) : (docData.id ? String(docData.id) : null);

    try {
      if (docId) {
        const { _id, id, ...payload } = docData;
        await this.colRef.doc(docId).set(payload, { merge: true });
      } else {
        const docRef = await this.colRef.add(docData);
        docId = docRef.id;
      }

      docData._id = docId;
      docData.id = docId;
      return this.wrap(docData);
    } catch (err: any) {
      console.error(`[FirestoreCollection:${this.name}] create error:`, err.message || err);
      throw err;
    }
  }

  async findByIdAndUpdate(id: any, update: any, options: { new?: boolean } = { new: true }) {
    if (!id) return null;
    const strId = String(id);

    try {
      const existing = await this.findById(strId);
      if (!existing) return null;

      const updatedData = { ...existing, ...update, updatedAt: new Date().toISOString() };
      const actualId = String(existing._id || strId);
      const { _id, id: _, ...payload } = updatedData;

      await this.colRef.doc(actualId).set(payload, { merge: true });
      return this.wrap({ ...updatedData, _id: actualId, id: actualId });
    } catch (err: any) {
      console.error(`[FirestoreCollection:${this.name}] findByIdAndUpdate error:`, err.message || err);
      return null;
    }
  }

  async findOneAndUpdate(query: any, update: any, options: { new?: boolean } = { new: true }) {
    const doc = await this.findOne(query);
    if (!doc) return null;
    return this.findByIdAndUpdate(doc._id || doc.id, update, options);
  }

  async findByIdAndDelete(id: any) {
    if (!id) return null;
    const strId = String(id);

    try {
      const existing = await this.findById(strId);
      if (!existing) return null;

      const actualId = String(existing._id || strId);
      await this.colRef.doc(actualId).delete();
      return existing;
    } catch (err: any) {
      console.error(`[FirestoreCollection:${this.name}] findByIdAndDelete error:`, err.message || err);
      return null;
    }
  }

  async countDocuments(query: any = {}) {
    try {
      if (!query || Object.keys(query).length === 0) {
        const countSnapshot = await this.colRef.count().get();
        return countSnapshot.data().count;
      }

      const raw = await this.fetchRaw(query);
      return raw.filter(it => matchesInMemory(it, query)).length;
    } catch (err: any) {
      console.error(`[FirestoreCollection:${this.name}] countDocuments error:`, err.message || err);
      return 0;
    }
  }

  async insertMany(docs: any[]) {
    if (!Array.isArray(docs) || docs.length === 0) return [];

    const firestore = getFirestore();
    const batch = firestore.batch();
    const results: any[] = [];
    const now = new Date().toISOString();

    for (const item of docs) {
      const docData = { ...item };
      if (!docData.createdAt) docData.createdAt = now;
      if (!docData.updatedAt) docData.updatedAt = now;

      let docId = docData._id ? String(docData._id) : (docData.id ? String(docData.id) : null);
      let ref: admin.firestore.DocumentReference;

      if (docId) {
        ref = this.colRef.doc(docId);
      } else {
        ref = this.colRef.doc();
        docId = ref.id;
      }

      docData._id = docId;
      docData.id = docId;
      const { _id, id, ...payload } = docData;

      batch.set(ref, payload, { merge: true });
      results.push(this.wrap(docData));
    }

    await batch.commit();
    return results;
  }

  async deleteMany(query: any = {}) {
    const items = await this.find(query);
    const firestore = getFirestore();
    const batch = firestore.batch();

    for (const item of items) {
      const docId = String((item as any)._id || (item as any).id);
      batch.delete(this.colRef.doc(docId));
    }

    await batch.commit();
    return { deletedCount: items.length };
  }
}
