

import React, { useState } from 'react';
import { X, Loader, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ForgotPasswordFormProps {
  onClose: () => void;
}

type FormStep = 'email' | 'otp' | 'newPassword' | 'success';

export function ForgotPasswordForm({ onClose }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<FormStep>('email');

  // ✅ Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await axios.post('http://localhost:11129/api/auth/forgot-password', { email });
      setCurrentStep('otp');
      toast.success('✅ OTP sent successfully!');
    } catch (err: any) {
      const message = err.response?.data?.message || '❌ Failed to send OTP. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await axios.post('http://localhost:11129/api/auth/verify-otp', { email, otp });
      setCurrentStep('newPassword');
      toast.success('✅ OTP verified successfully!');
    } catch (err: any) {
      const message = err.response?.data?.message || '❌ Invalid OTP. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('❌ Passwords do not match');
      toast.error('❌ Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('❌ Password must be at least 6 characters long');
      toast.error('❌ Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('http://localhost:11129/api/auth/reset-password', { email, newPassword });
      setCurrentStep('success');
      toast.success('✅ Password reset successfully!');
    } catch (err: any) {
      const message = err.response?.data?.message || '❌ Failed to reset password. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Close
  const handleClose = () => {
    toast.info('ℹ️ Forgot password process closed');
    onClose();
  };

  // ✅ Render Different Steps
  const renderStep = () => {
    switch (currentStep) {
      case 'email':
        return (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Send OTP'}
            </button>
          </form>
        );

      case 'otp':
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent tracking-widest text-center text-2xl"
                maxLength={6}
                placeholder="000000"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-red-700 text-white rounded-xl">
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Verify OTP'}
            </button>
          </form>
        );

      case 'newPassword':
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-red-700 text-white rounded-xl">
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : 'Reset Password'}
            </button>
          </form>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
            <button onClick={handleClose} className="px-6 py-2 text-sm font-medium text-red-700">
              Back to Login
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md relative">
        <button onClick={handleClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-500">
          <X className="h-6 w-6" />
        </button>
        <div className="p-8">{error && <p className="text-red-500">{error}</p>}{renderStep()}</div>
      </div>
    </div>
  );
}
