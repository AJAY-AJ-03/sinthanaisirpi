


import mongoose from 'mongoose';

const guideTeacherSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  udiseCode: {
    type: String,
    required: true,
    trim: true
  },
  schoolName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, 'Contact number must be 10 digits']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  }
}, {
  timestamps: true
});

// Remove the unique index on email
guideTeacherSchema.index({ email: 1 }, { unique: false });

// Create a compound unique index for email and verified status
guideTeacherSchema.index(
  { email: 1, verified: 1 },
  { 
    unique: true,
    partialFilterExpression: { verified: true },
    sparse: true
  }
);

// Pre-save middleware to handle data formatting
guideTeacherSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.isModified('fullName')) {
    this.fullName = this.fullName.trim();
  }
  if (this.isModified('contactNumber')) {
    this.contactNumber = this.contactNumber.trim();
  }
  next();
});

const GuideTeacher = mongoose.model('GuideTeacher', guideTeacherSchema);

export default GuideTeacher;