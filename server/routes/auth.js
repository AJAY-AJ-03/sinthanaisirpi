// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import School from '../models/School.js';
// import { transporter } from '../config/email.js';
// import { authenticateToken } from '../middleware/auth.js';
// import dotenv from 'dotenv';


// dotenv.config();
// console.log(process.env.JWT_SECRET,"JWT_SECRET")


// const router = express.Router();

// router.post('/signup',authenticateToken, async (req, res) => {
//   try {
//     const { schoolName, email, district, udiseCode, password } = req.body;

//     const existingSchool = await School.findOne({ 
//       $or: [
//         { email },
//         { udiseCode }
//       ]
//     });

//     if (existingSchool) {
//       if (existingSchool.email === email) {
//         return res.status(400).json({ message: 'Email already registered' });
//       }
//       if (existingSchool.udiseCode === udiseCode) {
//         return res.status(400).json({ message: 'UDISE code already registered' });
//       }
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const school = new School({
//       schoolName,
//       email,
//       district,
//       udiseCode,
//       password: hashedPassword
//     });

//     await school.save();

//     res.status(201).json({ message: 'Registration successful' });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/login' , async (req, res) => {
//   try {
//     const { udiseCode, password } = req.body;

//     const school = await School.findOne({ udiseCode });
//     if (!school) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, school.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: school._id },
//       process.env.JWT_SECRET || 'vosa',
//       { expiresIn: '1d' }
//     );

//     res.json({
//       token,
//       school: {
//         id: school._id,
//         schoolName: school.schoolName,
//         email: school.email,
//         district: school.district,
//         udiseCode: school.udiseCode
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/forgot-password', authenticateToken ,async (req, res) => {
//   try {
//     const { email } = req.body;
//     const school = await School.findOne({ email });
//     if (!school) {
//       return res.status(404).json({ message: 'School not found' });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiresAt = new Date();
//     otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);

//     school.resetOTP = {
//       code: otp,
//       expiresAt: otpExpiresAt
//     };
//     await school.save();

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Password Reset OTP',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #4F46E5; text-align: center;">Password Reset Request</h2>
//           <div style="background-color: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
//             <p style="margin: 0; font-size: 16px;">Your OTP for password reset is:</p>
//             <h1 style="color: #4F46E5; text-align: center; font-size: 32px; letter-spacing: 5px; margin: 20px 0;">${otp}</h1>
//             <p style="margin: 0; font-size: 14px; color: #6B7280;">This OTP will expire in 10 minutes.</p>
//           </div>
//         </div>
//       `
//     });

//     res.json({ message: 'OTP sent successfully' });
//   } catch (error) {
//     console.error('Forgot password error:', error);
//     res.status(500).json({ message: 'Failed to send OTP' });
//   }
// });

// router.post('/verify-otp',authenticateToken , async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const school = await School.findOne({ email });
    
//     if (!school || !school.resetOTP || !school.resetOTP.code || !school.resetOTP.expiresAt) {
//       return res.status(400).json({ message: 'Invalid OTP request' });
//     }

//     if (new Date() > school.resetOTP.expiresAt) {
//       return res.status(400).json({ message: 'OTP has expired' });
//     }

//     if (school.resetOTP.code !== otp) {
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     school.resetOTP = undefined;
//     await school.save();

//     res.json({ message: 'OTP verified successfully' });
//   } catch (error) {
//     console.error('OTP verification error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/reset-password',authenticateToken , async (req, res) => {
//   try {
//     const { email, newPassword } = req.body;
//     const school = await School.findOne({ email });
    
//     if (!school) {
//       return res.status(404).json({ message: 'School not found' });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     school.password = hashedPassword;
//     await school.save();

//     res.json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error('Password reset error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;


import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import School from '../models/School.js';
import { transporter } from '../config/email.js';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.JWT_SECRET, "JWT_SECRET");

const router = express.Router();

// ✅ SIGNUP (Protected)
router.post('/signup', async (req, res) => {
  try {
    const { schoolName, email, district, udiseCode, password } = req.body;

    const existingSchool = await School.findOne({ 
      $or: [
        { email },
        { udiseCode }
      ]
    });

    if (existingSchool) {
      if (existingSchool.email === email) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      if (existingSchool.udiseCode === udiseCode) {
        return res.status(400).json({ message: 'UDISE code already registered' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const school = new School({
      schoolName,
      email,
      district,
      udiseCode,
      password: hashedPassword
    });

    await school.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ LOGIN (Public)
router.post('/login', async (req, res) => {
  try {
    const { udiseCode, password } = req.body;

    const school = await School.findOne({ udiseCode });
    if (!school) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: school._id },
      process.env.JWT_SECRET || 'vosa',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      school: {
        id: school._id,
        schoolName: school.schoolName,
        email: school.email,
        district: school.district,
        udiseCode: school.udiseCode
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ FORGOT PASSWORD (Public)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const school = await School.findOne({ email });

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);

    school.resetOTP = { code: otp, expiresAt: otpExpiresAt };
    await school.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5; text-align: center;">Password Reset Request</h2>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">Your OTP for password reset is:</p>
            <h1 style="color: #4F46E5; text-align: center; font-size: 32px; letter-spacing: 5px; margin: 20px 0;">${otp}</h1>
            <p style="margin: 0; font-size: 14px; color: #6B7280;">This OTP will expire in 10 minutes.</p>
          </div>
        </div>
      `
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// ✅ VERIFY OTP (Public)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const school = await School.findOne({ email });

    if (!school || !school.resetOTP) {
      return res.status(400).json({ message: 'Invalid OTP request' });
    }

    if (new Date() > school.resetOTP.expiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (school.resetOTP.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    school.resetOTP = undefined;
    await school.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ RESET PASSWORD (Public)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const school = await School.findOne({ email });

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    school.password = hashedPassword;
    await school.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


