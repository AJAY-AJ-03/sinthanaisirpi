
// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import Evaluator from '../models/Evaluator.js';
// import Project from '../models/Project.js';
// import { authenticateToken } from '../middleware/auth.js';

// const router = express.Router();

// // Initialize default evaluators if they don't exist
// const initializeDefaultEvaluators = async () => {
//   const defaultEvaluators = [
//     { username: 'evaluator1', password: 'eval1pass', evaluatorNumber: 1 },
//     { username: 'evaluator2', password: 'eval2pass', evaluatorNumber: 2 },
//     { username: 'evaluator3', password: 'eval3pass', evaluatorNumber: 3 }
//   ];

//   for (const evaluator of defaultEvaluators) {
//     const exists = await Evaluator.findOne({ username: evaluator.username });
//     if (!exists) {
//       const hashedPassword = await bcrypt.hash(evaluator.password, 10);
//       await Evaluator.create({
//         ...evaluator,
//         password: hashedPassword
//       });
//     }
//   }
// };

// initializeDefaultEvaluators();

// // Evaluator login
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const evaluator = await Evaluator.findOne({ username });

//     if (!evaluator) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, evaluator.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: evaluator._id, evaluatorNumber: evaluator.evaluatorNumber },
//       process.env.JWT_SECRET || 'vosa',
//       { expiresIn: '1d' }
//     );

//     res.json({
//       token,
//       evaluator: {
//         id: evaluator._id,
//         username: evaluator.username,
//         evaluatorNumber: evaluator.evaluatorNumber
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get projects for evaluation
// router.get('/projects', authenticateToken, async (req, res) => {
//   try {
//     // Get all submitted projects that haven't been fully evaluated
//     const projects = await Project.find({
//       status: { $in: ['submitted', 'under_review'] }
//     }).populate('schoolId', 'schoolName udiseCode');

//     // Filter projects based on evaluator number (1-based indexing)
//     const evaluatorNumber = req.user.evaluatorNumber;
//     const assignedProjects = projects.filter((project, index) =>
//       (index % 3) === (evaluatorNumber - 1)
//     );

//     // Further filter out projects that this evaluator has already evaluated
//     const unevaluatedProjects = assignedProjects.filter(project => {
//       const evaluatorKey = `evaluator${evaluatorNumber}`;
//       return !project.evaluatorScores[evaluatorKey]?.evaluatedAt;
//     });

//     res.json(unevaluatedProjects);
//   } catch (error) {
//     console.error('Fetch projects error:', error);
//     res.status(500).json({ message: 'Failed to fetch projects' });
//   }
// });

// // Submit evaluation
// // Submit evaluation
// router.post('/evaluate/:projectId', authenticateToken, async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const { score, reason, status } = req.body; // `status` will be 'accepted' or 'rejected'

//     if (!req.user || !req.user.evaluatorNumber) {
//       return res.status(403).json({ message: 'Unauthorized: Evaluator role not found' });
//     }

//     const evaluatorNumber = req.user.evaluatorNumber;
//     const evaluatorKey = `evaluator${evaluatorNumber}`;

//     // Find the project
//     const project = await Project.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     // Update the evaluator's score and status based on accept/reject
//     const update = {
//       [`evaluatorScores.${evaluatorKey}`]: {
//         score: score,
//         reason: reason,
//         evaluatedAt: new Date()
//       },
//       [`evaluatorStatus.${evaluatorKey}`]: status // 'accepted' or 'rejected'
//     };

//     // Update project with the new evaluation
//     const updatedProject = await Project.findByIdAndUpdate(
//       projectId,
//       { $set: update },
//       { new: true }
//     );

//     res.json({
//       message: `Evaluation submitted successfully as ${status}`,
//       project: updatedProject
//     });
//   } catch (error) {
//     console.error('Evaluation submission error:', error);
//     res.status(500).json({ message: 'Failed to submit evaluation' });
//   }
// });




// // router.get('/accepted-projects', authenticateToken, async (req, res) => {
// //   try {
// //     const projects = await Project.find({
// //       $or: [
// //         { "evaluatorStatus.evaluator1": "accepted" },
// //         { "evaluatorStatus.evaluator2": "accepted" },
// //         { "evaluatorStatus.evaluator3": "accepted" }
// //       ]
// //     }).select('schoolId evaluatorStatus evaluatorScores projectFiles');  // Only required fields

// //     res.json(projects);
// //   } catch (error) {
// //     console.error('Error fetching accepted projects:', error);
// //     res.status(500).json({ message: 'Failed to fetch accepted projects' });
// //   }
// // });



// router.get('/accepted-projects', authenticateToken, async (req, res) => {
//   try {
//     const projects = await Project.find({
//       $or: [
//         { "evaluatorStatus.evaluator1": "accepted" },
//         { "evaluatorStatus.evaluator2": "accepted" },
//         { "evaluatorStatus.evaluator3": "accepted" }
//       ]
//     })
//     .populate('schoolId', 'schoolName udiseCode') // Populate school details
//     .select('schoolId evaluatorStatus evaluatorScores projectFiles');  // Only required fields

//     res.json(projects);
//   } catch (error) {
//     console.error('Error fetching accepted projects:', error);
//     res.status(500).json({ message: 'Failed to fetch accepted projects' });
//   }
// });




// export default router;



import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Evaluator from '../models/Evaluator.js';
import Project from '../models/Project.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Initialize default evaluators if they don't exist
const initializeDefaultEvaluators = async () => {
  const defaultEvaluators = [
    { username: 'evaluator1', password: 'eval1pass', evaluatorNumber: 1 },
    { username: 'evaluator2', password: 'eval2pass', evaluatorNumber: 2 },
    { username: 'evaluator3', password: 'eval3pass', evaluatorNumber: 3 }
  ];

  for (const evaluator of defaultEvaluators) {
    const exists = await Evaluator.findOne({ username: evaluator.username });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(evaluator.password, 10);
      await Evaluator.create({
        ...evaluator,
        password: hashedPassword
      });
    }
  }
};

initializeDefaultEvaluators();

// Evaluator login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const evaluator = await Evaluator.findOne({ username });

    if (!evaluator) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, evaluator.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: evaluator._id, evaluatorNumber: evaluator.evaluatorNumber },
      process.env.JWT_SECRET || 'vosa',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      evaluator: {
        id: evaluator._id,
        username: evaluator.username,
        evaluatorNumber: evaluator.evaluatorNumber
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get projects for evaluation
router.get('/projects', authenticateToken, async (req, res) => {
  try {
    // Get all submitted projects that haven't been fully evaluated
    const projects = await Project.find({ 
      status: { $in: ['submitted', 'under_review'] }
    }).populate('schoolId', 'schoolName udiseCode');

    // Filter projects based on evaluator number (1-based indexing)
    const evaluatorNumber = req.user.evaluatorNumber;
    const assignedProjects = projects.filter((project, index) => 
      (index % 3) === (evaluatorNumber - 1)
    );

    // Further filter out projects that this evaluator has already evaluated
    const unevaluatedProjects = assignedProjects.filter(project => {
      const evaluatorKey = `evaluator${evaluatorNumber}`;
      return !project.evaluatorScores[evaluatorKey]?.evaluatedAt;
    });

    res.json(unevaluatedProjects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});


// Submit evaluation
router.post('/evaluate/:projectId', authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { score, reason, status } = req.body;
    const evaluatorNumber = req.user.evaluatorNumber; // Fetch from logged-in user

    if (!evaluatorNumber) {
      return res.status(403).json({ message: 'Unauthorized: Evaluator role not found' });
    }

    const evaluatorKey = `evaluatorScores.evaluator${evaluatorNumber}`; // Dynamic key

    // Find project and update evaluator's score
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        $set: {
          [evaluatorKey]: {
            score: score,
            reason: reason,
            evaluatedAt: new Date()
          },
          [`evaluatorStatus.evaluator${evaluatorNumber}`]: status
        }
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: `Evaluation submitted successfully as ${status}`,
      project
    });
  } catch (error) {
    console.error('Evaluation submission error:', error);
    res.status(500).json({ message: 'Failed to submit evaluation' });
  }
});


router.get('/accepted-projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { "evaluatorStatus.evaluator1": "accepted" },
        { "evaluatorStatus.evaluator2": "accepted" },
        { "evaluatorStatus.evaluator3": "accepted" }
      ]
    })
    .populate('schoolId', 'schoolName udiseCode')
    .select('title description schoolId evaluatorStatus evaluatorScores projectFiles');
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching accepted projects:', error);
    res.status(500).json({ message: 'Failed to fetch accepted projects' });
  }
});

export default router;