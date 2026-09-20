import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStudentTodo extends Document {
  studentId: Types.ObjectId;
  title: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentTodoSchema = new Schema<IStudentTodo>({
  studentId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

// Index for efficient querying by student
StudentTodoSchema.index({ studentId: 1, createdAt: -1 });

export const StudentTodo = mongoose.models.StudentTodo || mongoose.model<IStudentTodo>('StudentTodo', StudentTodoSchema);
