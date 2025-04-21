



// import mongoose from 'mongoose';

// const projectSchema = new mongoose.Schema(
//   {
//     schoolId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'School',
//       required: true
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     description: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     status: {
//       type: String,
//       enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'accepted'],
//       default: 'draft'
//     },
//     submissionDate: {
//       type: Date,
//       default: Date.now
//     },
//     teamSize: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5
//     },
//     students: {
//       type: [
//         {
//           name: { type: String, trim: true },
//           fatherName: { type: String, trim: true },
//           dateOfBirth: { type: Date },
//           gender: { type: String, enum: ['male', 'female', 'other'] },
//           community: { type: String, enum: ['BC', 'MBC', 'ST', 'SC', 'General'] },
//           district: { type: String, trim: true },
//           standard: { type: String, trim: true },
//           school: { type: String, trim: true },
//           email: {
//             type: String,
//             trim: true,
//             lowercase: true,
//             match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
//           },
//           contactNumber: {
//             type: String,
//             trim: true,
//             match: [/^\d{10}$/, 'Contact number must be 10 digits']
//           }
//         }
//       ],
//       default: [],
//       required: false
//     },
//     guideTeacher: {
//       id: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideTeacher', required: true },
//       name: { type: String, required: true, trim: true },
//       email: { type: String, required: true, trim: true, lowercase: true },
//       contactNumber: { type: String, required: true, trim: true }
//     },
   
//     projectFiles: [
//       {
//         name: { type: String, required: true },
//         base64: { type: String, required: true }, // Store Base64 string
//         uploadedAt: { type: Date, default: Date.now }
//       }
//     ],
    
//     businessModelCanvas: {
//       customerSegments: { type: String, trim: true, default: '' },
//       valuePropositions: { type: String, trim: true, default: '' },
//       channels: { type: String, trim: true, default: '' },
//       customerRelationships: { type: String, trim: true, default: '' },
//       revenueStreams: { type: String, trim: true, default: '' },
//       keyResources: { type: String, trim: true, default: '' },
//       keyActivities: { type: String, trim: true, default: '' },
//       keyPartners: { type: String, trim: true, default: '' },
//       cost: { type: String, trim: true, default: '' }
//     },
//     evaluatorScores: {
//       evaluator1: {
//         type: Object,
//         default: {}
//       },
//       evaluator2: {
//         type: Object,
//         default: {}
//       },
//       evaluator3: {
//         type: Object,
//         default: {}
//       }
//     },
    
//     statusReason: {
//       type: String,
//       trim: true,
//       default: ''
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // Index for faster lookups
// projectSchema.index({ schoolId: 1, status: 1 });
// projectSchema.index({ 'guideTeacher.id': 1 });
// projectSchema.index({ submissionDate: -1 });
// projectSchema.index({ createdAt: -1 });

// // Pre-save hook for formatting
// projectSchema.pre('save', function (next) {
//   if (this.students.length) {
//     this.students.forEach(student => {
//       if (student.email) {
//         student.email = student.email.toLowerCase().trim();
//       }
//     });
//   }
//   if (this.guideTeacher?.email) {
//     this.guideTeacher.email = this.guideTeacher.email.toLowerCase().trim();
//   }
//   next();
// });

// const Project = mongoose.model('Project', projectSchema);

// export default Project;



import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'accepted'],
      default: 'draft'
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
    teamSize: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    students: {
      type: [
        {
          name: { type: String, trim: true },
          fatherName: { type: String, trim: true },
          dateOfBirth: { type: Date },
          gender: { type: String, enum: ['male', 'female', 'other'] },
          community: { type: String, enum: ['BC', 'MBC', 'ST', 'SC', 'General'] },
          district: { type: String, trim: true },
          standard: { type: String, trim: true },
          school: { type: String, trim: true },
          email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
          },
          contactNumber: {
            type: String,
            trim: true,
            match: [/^\d{10}$/, 'Contact number must be 10 digits']
          }
        }
      ],
      default: [],
      required: false
    },
    guideTeacher: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'GuideTeacher', required: true },
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      contactNumber: { type: String, required: true, trim: true }
    },
    projectFiles: [
      {
        name: { type: String, required: true },
        base64: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    businessModelCanvas: {
      customerSegments: { type: String, trim: true, default: '' },
      valuePropositions: { type: String, trim: true, default: '' },
      channels: { type: String, trim: true, default: '' },
      customerRelationships: { type: String, trim: true, default: '' },
      revenueStreams: { type: String, trim: true, default: '' },
      keyResources: { type: String, trim: true, default: '' },
      keyActivities: { type: String, trim: true, default: '' },
      keyPartners: { type: String, trim: true, default: '' },
      cost: { type: String, trim: true, default: '' }
    },
    evaluatorScores: {
      evaluator1: {
        type: Object,
        default: {}
      },
      evaluator2: {
        type: Object,
        default: {}
      },
      evaluator3: {
        type: Object,
        default: {}
      }
    },
    evaluatorStatus: {
      evaluator1: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
      },
      evaluator2: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
      },
      evaluator3: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
      }
    },
    statusReason: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index for faster lookups
projectSchema.index({ schoolId: 1, status: 1 });
projectSchema.index({ 'guideTeacher.id': 1 });
projectSchema.index({ submissionDate: -1 });
projectSchema.index({ createdAt: -1 });

// Pre-save hook for formatting
projectSchema.pre('save', function (next) {
  if (this.students.length) {
    this.students.forEach(student => {
      if (student.email) {
        student.email = student.email.toLowerCase().trim();
      }
    });
  }
  if (this.guideTeacher?.email) {
    this.guideTeacher.email = this.guideTeacher.email.toLowerCase().trim();
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;