import mongoose from 'mongoose';

const projectEvaluationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  evaluator1Score: {
    score: { type: Number, min: 0, max: 10 },
    reason: String,
    evaluatedAt: Date
  },
  evaluator2Score: {
    score: { type: Number, min: 0, max: 10 },
    reason: String,
    evaluatedAt: Date
  },
  evaluator3Score: {
    score: { type: Number, min: 0, max: 10 },
    reason: String,
    evaluatedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  finalReason: String
}, {
  timestamps: true
});

const ProjectEvaluation = mongoose.model('ProjectEvaluation', projectEvaluationSchema);

export default ProjectEvaluation;