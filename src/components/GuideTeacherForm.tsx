import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, School, Loader, AlertCircle, Mail, Phone, User, Hash, CheckCircle, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface GuideTeacherFormProps {
  onClose: () => void;
  onSuccess: () => void;
  schoolId: string;
  schoolName: string;
  udiseCode: string;
}

interface FormData {
  fullName: string;
  udiseCode: string;
  schoolName: string;
  contactNumber: string;
  email: string;
}

export function GuideTeacherForm({ onClose, onSuccess, schoolId, schoolName, udiseCode }: GuideTeacherFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    udiseCode: udiseCode,
    schoolName: schoolName,
    contactNumber: '',
    email: ''
  });
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setError('');

    if (name === 'contactNumber') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Email is required to send OTP');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:11129/api/guide-teachers/send-otp', {
        email: formData.email.trim().toLowerCase(),
        fullName: formData.fullName.trim(),
        udiseCode: formData.udiseCode,
        schoolName: formData.schoolName,
        contactNumber: formData.contactNumber.trim(),
        schoolId
      });
      setShowOtpInput(true);
      setOtpSent(true);
      toast.success('OTP sent successfully! Please check your email.');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter OTP');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:11129/api/guide-teachers/verify-otp', {
        email: formData.email.trim().toLowerCase(),
        otp: otp
      });
      setIsOtpVerified(true);
      toast.success('Email verified successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid OTP';
      setError(errorMessage);
      toast.error(errorMessage);
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!isOtpVerified) {
      setError('Please verify your email with OTP first');
      return;
    }
  
    const requiredFields: Record<string, string> = {
      fullName: 'Full name is required',
      contactNumber: 'Contact number is required',
      email: 'Email is required'
    };
  
    for (const [field, message] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData]?.trim()) {
        setError(message);
        return;
      }
    }
  
    if (!/^\d{10}$/.test(formData.contactNumber)) {
      setError('Contact number must be 10 digits');
      return;
    }
  
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
  
    setIsSubmitting(true);
    setError('');
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        toast.error('Authentication token not found. Please log in again.');
        return;
      }
  
      const response = await axios.post(
        'http://localhost:11129/api/guide-teachers',
        {
          fullName: formData.fullName.trim(),
          udiseCode: formData.udiseCode?.trim() || '',
          schoolName: formData.schoolName?.trim() || '',
          contactNumber: formData.contactNumber.trim(),
          email: formData.email.trim().toLowerCase(),
          schoolId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data) {
        setShowSuccessMessage(true);
        toast.success('Guide teacher registered successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      
      const errorMessage = err.response?.data?.message || 'Failed to register guide teacher';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendOtp = async () => {
    setOtp('');
    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:11129/api/guide-teachers/send-otp', {
        email: formData.email.trim().toLowerCase(),
        fullName: formData.fullName.trim(),
        udiseCode: formData.udiseCode,
        schoolName: formData.schoolName,
        contactNumber: formData.contactNumber.trim(),
        schoolId
      });
      toast.success('New OTP sent successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to resend OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccessMessage) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm w-full"
        >
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
          <p className="text-gray-600 mb-6">The guide teacher has been successfully registered.</p>
          <div className="w-full h-2 bg-green-500 rounded-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md relative"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-800"></div>
        
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Register Guide Teacher</h2>
          <p className="text-sm text-gray-500 mb-4">Add a new guide teacher to your school</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center text-sm">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="pl-10 w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div className="relative">
                <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="udiseCode"
                  value={formData.udiseCode}
                  readOnly
                  className="pl-10 w-full py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm"
                />
              </div>

              <div className="relative">
                <School className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  readOnly
                  className="pl-10 w-full py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact Number (10 digits)"
                  className="pl-10 w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
                  maxLength={10}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="pl-10 w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
                  disabled={isOtpVerified}
                />
              </div>

              {!isOtpVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || !formData.email}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {otpSent ? 'Resend OTP' : 'Send OTP'}
                    </>
                  )}
                </button>
              )}

              <AnimatePresence>
                {showOtpInput && !isOtpVerified && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtp(value);
                          setError('');
                        }}
                        placeholder="Enter 6-digit OTP"
                        className="w-full py-2.5 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-center tracking-widest"
                        maxLength={6}
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isLoading || otp.length !== 6}
                        className="flex-1 flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          'Verify OTP'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isOtpVerified && (
                <div className="flex items-center justify-center text-green-600 space-x-2 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span>Email verified successfully</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register Guide Teacher'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}