import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface QueryOptions {
  sort?: Record<string, 1 | -1>;
  limit?: number;
  skip?: number;
}

function matchesQuery(item: any, query: any): boolean {
  if (!query || Object.keys(query).length === 0) return true;

  for (const key of Object.keys(query)) {
    const val = query[key];

    if (key === '$or' && Array.isArray(val)) {
      const matchAny = val.some(subQuery => matchesQuery(item, subQuery));
      if (!matchAny) return false;
      continue;
    }

    if (key === '$and' && Array.isArray(val)) {
      const matchAll = val.every(subQuery => matchesQuery(item, subQuery));
      if (!matchAll) return false;
      continue;
    }

    const itemVal = item[key];

    // Handle operator objects like { $in: [...] }, { $gte: ... }, { $regex: ... }
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

export class QueryChain<T = any> implements PromiseLike<T[]> {
  private _query: any;
  private _collection: FileCollection<T>;
  private _sort?: Record<string, 1 | -1>;
  private _limit?: number;
  private _skip?: number;

  constructor(collection: FileCollection<T>, query: any = {}) {
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
    // Fluent stub
    return this;
  }

  populate(_field: any) {
    // Fluent stub
    return this;
  }

  private async execute(): Promise<T[]> {
    let items = this._collection.getAll().filter(item => matchesQuery(item, this._query));

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

export class FileCollection<T = any> {
  public name: string;
  private filePath: string;
  private cache: any[] = [];
  private loaded: boolean = false;

  constructor(name: string) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        this.cache = JSON.parse(raw || '[]');
      } else {
        this.cache = [];
        this.save();
      }
    } catch (e) {
      console.warn(`[FileDB] Error reading ${this.name}.json, initializing empty:`, e);
      this.cache = [];
    }
    this.loaded = true;
  }

  private save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.cache, null, 2), 'utf-8');
    } catch (e) {
      console.error(`[FileDB] Error writing ${this.name}.json:`, e);
    }
  }

  public getAll(): any[] {
    if (!this.loaded) this.load();
    return [...this.cache];
  }

  public wrap(doc: any): any {
    if (!doc) return null;
    const self = this;
    const wrapped = { ...doc };

    // Attach Mongoose-like helpers
    Object.defineProperty(wrapped, 'save', {
      enumerable: false,
      value: async function () {
        wrapped.updatedAt = new Date().toISOString();
        const idx = self.cache.findIndex(x => String(x._id) === String(wrapped._id));
        if (idx >= 0) {
          self.cache[idx] = { ...wrapped };
        } else {
          self.cache.unshift({ ...wrapped });
        }
        self.save();
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

  // Model methods
  find(query: any = {}) {
    return new QueryChain<T>(this, query);
  }

  async findOne(query: any = {}) {
    if (!this.loaded) this.load();
    const item = this.cache.find(it => matchesQuery(it, query));
    return item ? this.wrap(item) : null;
  }

  async findById(id: string) {
    if (!this.loaded) this.load();
    const item = this.cache.find(it => 
      String(it._id) === String(id) || 
      String(it.id) === String(id) ||
      (it.userId && String(it.userId) === String(id))
    );
    return item ? this.wrap(item) : null;
  }

  async create(doc: any) {
    if (!this.loaded) this.load();
    const now = new Date().toISOString();
    const newDoc = {
      _id: doc._id || crypto.randomBytes(12).toString('hex'),
      ...doc,
      createdAt: doc.createdAt || now,
      updatedAt: now,
    };
    this.cache.unshift(newDoc);
    this.save();
    return this.wrap(newDoc);
  }

  async insertMany(docs: any[]) {
    if (!this.loaded) this.load();
    const now = new Date().toISOString();
    const inserted = docs.map(d => ({
      _id: d._id || crypto.randomBytes(12).toString('hex'),
      ...d,
      createdAt: d.createdAt || now,
      updatedAt: now,
    }));
    this.cache.push(...inserted);
    this.save();
    return inserted.map(d => this.wrap(d));
  }

  async findByIdAndUpdate(id: string, update: any, options: { new?: boolean } = {}) {
    if (!this.loaded) this.load();
    const idx = this.cache.findIndex(it => 
      String(it._id) === String(id) || 
      String(it.id) === String(id) ||
      (it.userId && String(it.userId) === String(id))
    );
    if (idx === -1) return null;

    const oldItem = { ...this.cache[idx] };
    const updateData = update.$set ? { ...update.$set } : { ...update };
    delete updateData.$set;

    const newItem = {
      ...oldItem,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    this.cache[idx] = newItem;
    this.save();
    return this.wrap(options.new ? newItem : oldItem);
  }

  async findByIdAndDelete(id: string) {
    if (!this.loaded) this.load();
    const idx = this.cache.findIndex(it => 
      String(it._id) === String(id) || 
      String(it.id) === String(id) ||
      (it.userId && String(it.userId) === String(id))
    );
    if (idx === -1) return null;

    const [deleted] = this.cache.splice(idx, 1);
    this.save();
    return this.wrap(deleted);
  }

  async deleteMany(query: any = {}) {
    if (!this.loaded) this.load();
    const beforeCount = this.cache.length;
    this.cache = this.cache.filter(it => !matchesQuery(it, query));
    this.save();
    return { deletedCount: beforeCount - this.cache.length };
  }

  async countDocuments(query: any = {}) {
    if (!this.loaded) this.load();
    return this.cache.filter(it => matchesQuery(it, query)).length;
  }
}

// Global Collections instance
export const fileDb = {
  users: new FileCollection('users'),
  admissions: new FileCollection('admissions'),
  announcements: new FileCollection('announcements'),
  appointments: new FileCollection('appointments'),
  fees: new FileCollection('fees'),
  feeReceipts: new FileCollection('fee_receipts'),
  batches: new FileCollection('batches'),
  materials: new FileCollection('materials'),
  auditLogs: new FileCollection('audit_logs'),
};
