

import React, { useState, useEffect } from 'react';
import { X, Loader, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface LoginFormProps {
  onClose: () => void;
  onLoginSuccess: (userData: any) => void;
}

export function LoginForm({ onClose, onLoginSuccess }: LoginFormProps) {
  const [udiseCode, setUdiseCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    setUdiseCode('');
    setPassword('');
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:11129/api/auth/login', {
        udiseCode,
        password
      });

      const { token, school } = response.data || {};

      if (token && school) {
        localStorage.setItem('token', token);
        const schoolData = {
          id: school?.id || '',
          schoolName: school?.schoolName || '',
          email: school?.email || '',
          district: school?.district || '',
          udiseCode: school?.udiseCode || ''
        };
        localStorage.setItem('schoolData', JSON.stringify(schoolData));

        onLoginSuccess?.({ token, school: schoolData });
      } else {
        setError('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('schoolData');
      setError(err.response?.data?.message || 'Invalid UDISE code or password');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />;
  }

  if (showSignup) {
    return <SignupForm onClose={() => setShowSignup(false)} onSignupSuccess={() => setShowSignup(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-red-800"></div>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-red-800">Login</h2>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-700 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-700 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="udiseCode" className="block text-sm font-medium text-gray-700 mb-1">
                UDISE Code
              </label>
              <input
                type="text"
                id="udiseCode"
                value={udiseCode}
                onChange={(e) => setUdiseCode(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                placeholder="Enter your UDISE code"
                required
                pattern="[0-9]{11}"
                title="Please enter your 11-digit UDISE code"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
                autoComplete="new-password"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium text-red-800 hover:text-red-900"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowSignup(true)}
                  className="font-medium text-red-800 hover:text-red-900"
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
