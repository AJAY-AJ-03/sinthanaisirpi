import mongoose from 'mongoose';

const evaluatorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  evaluatorNumber: {
    type: Number,
    required: true,
    enum: [1, 2, 3]
  }
}, {
  timestamps: true
});

const Evaluator = mongoose.model('Evaluator', evaluatorSchema);

export default Evaluator;