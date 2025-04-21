

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import guideTeacherRoutes from './routes/guideTeachers.js';
import projectRoutes from './routes/projects.js';
// import studentRoutes from './routes/students.js';
import evaluatorRoutes from './routes/evaluators.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_portal')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/guide-teachers', guideTeacherRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/students', studentRoutes);
app.use('/api/evaluators', evaluatorRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/api/evaluators', evaluatorRoutes);


// Template download route
app.get('/api/download/template', (req, res) => {
  const filePath = path.join(__dirname, '../public/hackathon_template.pptx');
  res.download(filePath, 'hackathon_template.pptx', (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).json({ message: 'Failed to download template' });
    }
  });
});

const PORT = process.env.PORT || 11129;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});