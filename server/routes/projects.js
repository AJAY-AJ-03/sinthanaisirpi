


// // import express from 'express';
// // import Project from '../models/Project.js';
// // import { authenticateToken } from '../middleware/auth.js';

// // const router = express.Router();
// // router.post('/', authenticateToken, async (req, res) => {
// //   try {
// //     const { title, description, teamSize, students = [], guideTeacher } = req.body;

// //     // Validate required fields
// //     if (!title || !description || !teamSize || !guideTeacher) {
// //       return res.status(400).json({ message: 'Title, description, team size, and guide teacher are required' });
// //     }

// //     // Ensure students is an array (allow empty on creation)
// //     if (!Array.isArray(students)) {
// //       return res.status(400).json({ message: 'Students must be an array' });
// //     }

// //     // Validate student entries only when students are provided
// //     if (students.length > 0 && students.length !== teamSize) {
// //       return res.status(400).json({ message: 'Students array must match the team size if provided' });
// //     }

// //     for (let student of students) {
// //       if (!student.name || !student.email || !student.contactNumber) {
// //         return res.status(400).json({ message: 'Each student must have name, email, and contactNumber' });
// //       }
// //     }

// //     // Validate guideTeacher object
// //     if (!guideTeacher.id || !guideTeacher.name || !guideTeacher.email || !guideTeacher.contactNumber) {
// //       return res.status(400).json({ message: 'Guide teacher details are required' });
// //     }

// //     // Create new project
// //     const project = new Project({
// //       schoolId: req.user.id,
// //       title,
// //       description,
// //       teamSize,
// //       students, // ✅ This can now be empty at creation
// //       guideTeacher,
// //       status: 'draft'
// //     });

// //     await project.save();
// //     res.status(201).json({
// //       message: 'Project created successfully',
// //       project
// //     });
// //   } catch (error) {
// //     console.error('Create project error:', error);
// //     res.status(500).json({
// //       message: 'Failed to create project',
// //       error: error.message
// //     });
// //   }
// // });



// // // Get all projects for a school
// // router.get('/', authenticateToken, async (req, res) => {
// //   try {
// //     const projects = await Project.find({ schoolId: req.user.id })
// //       .sort({ createdAt: -1 });
// //     res.json(projects);
// //   } catch (error) {
// //     console.error('Fetch projects error:', error);
// //     res.status(500).json({ message: 'Failed to fetch projects' });
// //   }
// // });

// // // Get single project by ID
// // router.get('/:id', authenticateToken, async (req, res) => {
// //   try {
// //     const project = await Project.findOne({
// //       _id: req.params.id,
// //       schoolId: req.user.id
// //     });
    
// //     if (!project) {
// //       return res.status(404).json({ message: 'Project not found' });
// //     }
    
// //     res.json(project);
// //   } catch (error) {
// //     console.error('Fetch project error:', error);
// //     res.status(500).json({ message: 'Failed to fetch project' });
// //   }
// // });

// // // Update project
// // router.put('/:id', authenticateToken, async (req, res) => {
// //   try {
// //     const {
// //       title,
// //       description,
// //       teamSize,
// //       students,
// //       status
// //     } = req.body;

// //     const project = await Project.findOneAndUpdate(
// //       { _id: req.params.id, schoolId: req.user.id },
// //       {
// //         title,
// //         description,
// //         teamSize,
// //         students,
// //         status,
// //         updatedAt: Date.now()
// //       },
// //       { new: true }
// //     );

// //     if (!project) {
// //       return res.status(404).json({ message: 'Project not found' });
// //     }

// //     res.json({
// //       message: 'Project updated successfully',
// //       project
// //     });
// //   } catch (error) {
// //     console.error('Update project error:', error);
// //     res.status(500).json({ message: 'Failed to update project' });
// //   }
// // });

// // // Delete project
// // router.delete('/:id', authenticateToken, async (req, res) => {
// //   try {
// //     const project = await Project.findOneAndDelete({
// //       _id: req.params.id,
// //       schoolId: req.user.id
// //     });

// //     if (!project) {
// //       return res.status(404).json({ message: 'Project not found' });
// //     }

// //     res.json({ message: 'Project deleted successfully' });
// //   } catch (error) {
// //     console.error('Delete project error:', error);
// //     res.status(500).json({ message: 'Failed to delete project' });
// //   }
// // });

// // // Add comment to project
// // router.post('/:id/comments', authenticateToken, async (req, res) => {
// //   try {
// //     const { text } = req.body;
    
// //     const project = await Project.findOneAndUpdate(
// //       { _id: req.params.id, schoolId: req.user.id },
// //       {
// //         $push: {
// //           comments: {
// //             text,
// //             author: req.user.name || 'School Admin'
// //           }
// //         }
// //       },
// //       { new: true }
// //     );

// //     if (!project) {
// //       return res.status(404).json({ message: 'Project not found' });
// //     }

// //     res.json({
// //       message: 'Comment added successfully',
// //       project
// //     });
// //   } catch (error) {
// //     console.error('Add comment error:', error);
// //     res.status(500).json({ message: 'Failed to add comment' });
// //   }
// // });

// // // Upload project files
// // router.post('/:id/files', authenticateToken, async (req, res) => {
// //   try {
// //     const { name, url } = req.body;

// //     const project = await Project.findOneAndUpdate(
// //       { _id: req.params.id, schoolId: req.user.id },
// //       {
// //         $push: {
// //           projectFiles: {
// //             name,
// //             url,
// //             uploadedAt: Date.now()
// //           }
// //         }
// //       },
// //       { new: true }
// //     );

// //     if (!project) {
// //       return res.status(404).json({ message: 'Project not found' });
// //     }

// //     res.json({
// //       message: 'File uploaded successfully',
// //       project
// //     });
// //   } catch (error) {
// //     console.error('File upload error:', error);
// //     res.status(500).json({ message: 'Failed to upload file' });
// //   }
// // });

// // export default router;

// import express from 'express';
// import Project from '../models/Project.js';
// import { authenticateToken } from '../middleware/auth.js';

// const router = express.Router();

// // ✅ Step 1: Create a new project (Only Basic Details)
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const { title, description, teamSize, guideTeacher } = req.body;

//     if (!title || !description || !teamSize || !guideTeacher) {
//       return res.status(400).json({ message: 'Title, description, team size, and guide teacher are required' });
//     }

//     const project = new Project({
//       schoolId: req.user.id,
//       title,
//       description,
//       teamSize,
//       guideTeacher,
//       status: 'draft'
//     });

//     await project.save();
//     res.status(201).json({ message: 'Project created successfully', project });
//   } catch (error) {
//     console.error('Create project error:', error);
//     res.status(500).json({ message: 'Failed to create project', error: error.message });
//   }
// });

// // ✅ Step 2: Update Project with Student Details
// router.put('/:id/students', authenticateToken, async (req, res) => {
//   try {
//     const { students } = req.body;

//     if (!Array.isArray(students)) {
//       return res.status(400).json({ message: 'Students must be an array' });
//     }

//     const project = await Project.findOneAndUpdate(
//       { _id: req.params.id, schoolId: req.user.id },
//       { $set: { students } },
//       { new: true }
//     );

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     res.json({ message: 'Students added successfully', project });
//   } catch (error) {
//     console.error('Update students error:', error);
//     res.status(500).json({ message: 'Failed to update students' });
//   }
// });

// // ✅ Step 3: Update Project with BMC Details
// router.put('/:id/bmc', authenticateToken, async (req, res) => {
//   try {
//     const { businessModelCanvas } = req.body;

//     const project = await Project.findOneAndUpdate(
//       { _id: req.params.id, schoolId: req.user.id },
//       { $set: { businessModelCanvas } },
//       { new: true }
//     );

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     res.json({ message: 'Business Model Canvas updated successfully', project });
//   } catch (error) {
//     console.error('Update BMC error:', error);
//     res.status(500).json({ message: 'Failed to update Business Model Canvas' });
//   }
// });

// // ✅ Step 4: Upload Documents to the Same Project
// router.post('/:id/files', authenticateToken, async (req, res) => {
//   try {
//     const { name, url } = req.body;

//     const project = await Project.findOneAndUpdate(
//       { _id: req.params.id, schoolId: req.user.id },
//       {
//         $push: {
//           projectFiles: {
//             name,
//             url,
//             uploadedAt: Date.now()
//           }
//         }
//       },
//       { new: true }
//     );

//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }

//     res.json({ message: 'File uploaded successfully', project });
//   } catch (error) {
//     console.error('File upload error:', error);
//     res.status(500).json({ message: 'Failed to upload file' });
//   }
// });

// export default router;

import express from 'express';
import Project from '../models/Project.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, teamSize, students = [], guideTeacher } = req.body;

    // Validate required fields
    if (!title || !description || !teamSize || !guideTeacher) {
      return res.status(400).json({ message: 'Title, description, team size, and guide teacher are required' });
    }

    // Create new project
    const project = new Project({
      schoolId: req.user.id,
      title,
      description,
      teamSize,
      students,
      guideTeacher,
      status: 'draft'
    });

    await project.save();
    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const updateData = req.body;

    // Find and update the project
    const project = await Project.findOneAndUpdate(
      { _id: projectId, schoolId: req.user.id },
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// Get all projects for a school
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ schoolId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Get single project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      schoolId: req.user.id
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Fetch project error:', error);
    res.status(500).json({ message: 'Failed to fetch project' });
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      schoolId: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});


router.post('/:id/files', authenticateToken, async (req, res) => {
  try {
    const { name, base64 } = req.body;

    if (!name || !base64) {
      return res.status(400).json({ message: 'File name and Base64 content are required' });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.user.id },
      {
        $push: {
          projectFiles: {
            name,
            base64,
            uploadedAt: Date.now()
          }
        }
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'File uploaded successfully',
      project
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});




export default router;