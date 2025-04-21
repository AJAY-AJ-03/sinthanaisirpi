


import express from 'express';
import GuideTeacher from '../models/GuideTeacher.js';
import { authenticateToken } from '../middleware/auth.js';
import { transporter } from '../config/email.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

// Temporary storage for OTPs
const otpStorage = new Map();


router.post('/verify', async (req, res) => {
  try {
    const { udiseCode, email } = req.body;

    if (!udiseCode || !email) {
      return res.status(400).json({ 
        message: 'UDISE code and email are required' 
      });
    }

    // Find guide teacher with matching UDISE code and email
    const guideTeacher = await GuideTeacher.findOne({
      udiseCode: udiseCode,
      email: email.toLowerCase(),
      verified: true
    });

    if (!guideTeacher) {
      return res.status(404).json({
        message: 'Guide teacher not found or not verified'
      });
    }

    // Use process.env.JWT_SECRET instead of JWT_SECRET
const token = jwt.sign(
  { id: guideTeacher._id, role: 'guide-teacher' },
  process.env.JWT_SECRET || 'vosa', // Ensure this is set in your .env file
  { expiresIn: '1h' } // Token expiry time
);


    res.json({
      verified: true,
      token,  // Send Token in response
      guideTeacher: {
        id: guideTeacher._id,
        fullName: guideTeacher.fullName,
        email: guideTeacher.email,
        schoolName: guideTeacher.schoolName,
        udiseCode: guideTeacher.udiseCode,
        contactNumber: guideTeacher.contactNumber
      }
    });

  } catch (error) {
    console.error('Guide teacher verification error:', error);
    res.status(500).json({ message: 'Failed to verify guide teacher' });
  }
});



router.post('/send-otp', async (req, res) => {
  try {
    const { email, fullName, udiseCode, schoolName, contactNumber, schoolId } = req.body;

    // Validate required fields
    if (!email || !fullName || !udiseCode || !schoolName || !contactNumber || !schoolId) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    // Check if a verified guide teacher exists
    const existingTeacher = await GuideTeacher.findOne({
      email: email.toLowerCase(),
      verified: true
    });

    if (existingTeacher) {
      return res.status(400).json({
        message: 'A verified guide teacher already exists with this email address'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);

    // Store OTP in temporary storage
    otpStorage.set(email.toLowerCase(), {
      otp,
      expiresAt: otpExpiresAt,
      fullName,
      udiseCode,
      schoolName,
      contactNumber,
      schoolId
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Guide Teacher Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5; text-align: center;">Email Verification</h2>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">Your verification code is:</p>
            <h1 style="color: #4F46E5; text-align: center; font-size: 32px; letter-spacing: 5px; margin: 20px 0;">${otp}</h1>
            <p style="margin: 0; font-size: 14px; color: #6B7280;">This code will expire in 10 minutes.</p>
          </div>
        </div>
      `
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const storedData = otpStorage.get(email.toLowerCase());

    if (!storedData) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    if (new Date() > storedData.expiresAt) {
      otpStorage.delete(email.toLowerCase());
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid - return success but don't save anything yet
    res.json({
      message: 'Email verified successfully',
      verifiedData: {
        fullName: storedData.fullName,
        email: email.toLowerCase(),
        schoolName: storedData.schoolName,
        udiseCode: storedData.udiseCode,
        contactNumber: storedData.contactNumber
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { fullName, udiseCode, schoolName, contactNumber, email, schoolId } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate required fields
    if (!fullName || !udiseCode || !schoolName || !contactNumber || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing verified guide teacher
    const existingTeacher = await GuideTeacher.findOne({
      email: email.toLowerCase(),
      verified: true
    });

    if (existingTeacher) {
      return res.status(400).json({
        message: 'A verified guide teacher already exists with this email address'
      });
    }

    // Verify that email was previously verified with OTP
    const storedData = otpStorage.get(email.toLowerCase());
    if (!storedData) {
      return res.status(400).json({ message: 'Email verification required before registration' });
    }

    // Create new guide teacher
    const newGuideTeacher = new GuideTeacher({
      fullName: fullName.trim(),
      udiseCode,
      schoolName,
      contactNumber: contactNumber.trim(),
      email: email.toLowerCase(),
      schoolId: schoolId || req.user.id,
      verified: true
    });

    await newGuideTeacher.save();

    // Clear OTP data after successful registration
    otpStorage.delete(email.toLowerCase());

    res.status(201).json({
      message: 'Guide teacher registered successfully',
      guideTeacher: newGuideTeacher
    });
  } catch (error) {
    console.error('Create guide teacher error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A guide teacher with this email already exists'
      });
    }

    res.status(500).json({ message: 'Failed to create guide teacher' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const guideTeachers = await GuideTeacher.find({ schoolId: req.user.id });
    res.json(guideTeachers);
  } catch (error) {
    console.error('Fetch guide teachers error:', error);
    res.status(500).json({ message: 'Failed to fetch guide teachers' });
  }
});

export default router;