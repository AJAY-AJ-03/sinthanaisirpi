import express from 'express';
import Admin from '../models/Admin.js';
import School from '../models/School.js';
import GuideTeacher from '../models/GuideTeacher.js';
import Project from '../models/Project.js';
import { authenticateToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Create default admin if not exists
const initializeDefaultAdmin = async () => {
  const defaultUsername = 'Vosa Tech';
  const defaultPassword = 'Vosa@2025';

  const existing = await Admin.findOne({ username: defaultUsername });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newAdmin = new Admin({
      username: defaultUsername,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();
    console.log('✅ Default admin account created successfully');
  } else {
    console.log('ℹ️ Default admin already exists');
  }
};

initializeDefaultAdmin();




// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt for username:', username); // Debug log
    
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      console.log('Admin not found'); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = password === 'Vosa@2025';
    console.log('Password match:', isMatch); // Debug log

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        role: 'admin',
        username: admin.username 
      },
      process.env.JWT_SECRET || 'vosa',
      { expiresIn: '24h' }
    );

    console.log('Token generated:', token); // Debug log

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /schools (protected by token)
router.get('/schools', authenticateToken, async (req, res) => {
  try {
    const schools = await School.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(schools);
  } catch (error) {
    console.error('Fetch schools error:', error);
    res.status(500).json({ message: 'Failed to fetch schools' });
  }
});


// Get specific school details with related data
router.get('/schools/:id', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.params.id;
    const school = await School.findById(schoolId).select('-password');
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const [guideTeachers, projects] = await Promise.all([
      GuideTeacher.find({ schoolId: schoolId }),
      Project.find({ schoolId: schoolId })
    ]);

    res.json({
      school,
      guideTeachers,
      projects
    });
  } catch (error) {
    console.error('Fetch school details error:', error);
    res.status(500).json({ message: 'Failed to fetch school details' });
  }
});

// Get all evaluators
router.get('/evaluators', authenticateToken, async (req, res) => {
  try {
    const evaluators = await Evaluator.find().select('-password');
    res.json(evaluators);
  } catch (error) {
    console.error('Fetch evaluators error:', error);
    res.status(500).json({ message: 'Failed to fetch evaluators' });
  }
});

// Get accepted projects
router.get('/projects/accepted', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ status: 'approved' })
      .populate('schoolId', 'schoolName udiseCode')
      .sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Fetch accepted projects error:', error);
    res.status(500).json({ message: 'Failed to fetch accepted projects' });
  }
});

// Get rejected projects
router.get('/projects/rejected', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ status: 'rejected' })
      .populate('schoolId', 'schoolName udiseCode')
      .sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Fetch rejected projects error:', error);
    res.status(500).json({ message: 'Failed to fetch rejected projects' });
  }
});

// Get deleted schools
router.get('/schools/deleted', authenticateToken, async (req, res) => {
  try {
    const deletedSchools = await School.find({ deleted: true })
      .select('-password')
      .sort({ deletedAt: -1 });
    res.json(deletedSchools);
  } catch (error) {
    console.error('Fetch deleted schools error:', error);
    res.status(500).json({ message: 'Failed to fetch deleted schools' });
  }
});

// Delete school (soft delete)
router.delete('/schools/:id', authenticateToken, async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    school.deleted = true;
    school.deletedAt = new Date();
    await school.save();

    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    console.error('Delete school error:', error);
    res.status(500).json({ message: 'Failed to delete school' });
  }
});

// Restore deleted school
router.post('/schools/:id/restore', authenticateToken, async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    school.deleted = false;
    school.deletedAt = null;
    await school.save();

    res.json({ message: 'School restored successfully' });
  } catch (error) {
    console.error('Restore school error:', error);
    res.status(500).json({ message: 'Failed to restore school' });
  }
});

// Get dashboard statistics
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    const [
      totalSchools,
      totalProjects,
      acceptedProjects,
      rejectedProjects,
      totalGuideTeachers
    ] = await Promise.all([
      School.countDocuments({ deleted: { $ne: true } }),
      Project.countDocuments(),
      Project.countDocuments({ status: 'approved' }),
      Project.countDocuments({ status: 'rejected' }),
      GuideTeacher.countDocuments()
    ]);

    res.json({
      totalSchools,
      totalProjects,
      acceptedProjects,
      rejectedProjects,
      totalGuideTeachers
    });
  } catch (error) {
    console.error('Fetch statistics error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

export default router;