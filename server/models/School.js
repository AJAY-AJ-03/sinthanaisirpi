import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema(
  {
  schoolName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  district: {
    type: String,
    required: true,
    enum: ['Madurai', 'Viruthunagar', 'Thuthukudi', 'Tirunelveli', 'Kanyakumari', 'Tenkasi']
  },
  udiseCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  resetOTP: {
    code: String,
    expiresAt: Date
  }
},
 {
  timestamps: true
}
);

const School = mongoose.model('School', schoolSchema);

export default School;