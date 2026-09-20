import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  standard: { type: String },
  message: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'CONTACTED', 'RESOLVED'],
    default: 'PENDING'
  },
  createdAt: { type: Date, default: Date.now }
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);
