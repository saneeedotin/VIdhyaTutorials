import mongoose from 'mongoose';

const admissionApplicationSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  fatherName: { type: String },
  motherName: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  religion: { type: String },
  nationality: { type: String, default: 'Indian' },
  nidNumber: { type: String }, // Aadhar / NID Number
  bloodGroup: { type: String },
  occupation: { type: String },
  maritalStatus: { type: String, default: 'Single' },
  
  // Present Address
  presentDivision: { type: String },
  presentDistrict: { type: String },
  presentAddress: { type: String },

  // Permanent Address
  permanentDivision: { type: String },
  permanentDistrict: { type: String },
  permanentAddress: { type: String },

  // Academic Details
  previousSchool: { type: String },
  standard: { type: String, required: true },
  stream: { type: String },
  courseName: { type: String },
  enrollmentType: { type: String, enum: ['ALL_SUBJECTS', 'INDIVIDUAL_SUBJECTS'], default: 'ALL_SUBJECTS' },
  subjects: [{ type: String }],
  
  // Signatures & Photo
  photoUrl: { type: String },
  studentSignature: { type: String },
  parentSignature: { type: String },
  declarationAccepted: { type: Boolean, default: true },

  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'Pending', 'Approved', 'Rejected'], default: 'PENDING' },
  submittedAt: { type: Date, default: Date.now },
});

export const AdmissionApplication = mongoose.model('AdmissionApplication', admissionApplicationSchema);
