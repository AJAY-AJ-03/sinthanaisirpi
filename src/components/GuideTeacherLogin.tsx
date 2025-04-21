import React, { useState } from 'react';
import { X, Loader, AlertCircle, School, Mail } from 'lucide-react';
import axios from 'axios';
import { GuideTeacherForm } from './GuideTeacherForm';
import toast from 'react-hot-toast';

interface GuideTeacherLoginProps {
  onClose: () => void;
  onLoginSuccess: (userData: any, token: string) => void; // Accept token as second argument
}

export function GuideTeacherLogin({ onClose, onLoginSuccess }: GuideTeacherLoginProps) {
  const [udiseCode, setUdiseCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      // Validate inputs
      if (!udiseCode || !email) {
        throw new Error('Please fill in all fields');
      }
  
      if (udiseCode.length !== 11) {
        throw new Error('UDISE code must be 11 digits');
      }
  
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
  
      // Send login request
      const response = await axios.post('http://localhost:11129/api/guide-teachers/verify', {
        udiseCode: udiseCode.trim(),
        email: email.toLowerCase().trim()
      });
  
      if (response.data.verified) {
        // ✅ Store token in localStorage
        const token = response.data.token;
        localStorage.setItem('authToken', token);
  
        toast.success('Login successful!');
  
        // ✅ Pass token to onLoginSuccess
        onLoginSuccess(response.data.guideTeacher, token);
      } else {
        setError('Guide teacher not found or not verified');
        toast.error('Login failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid credentials';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSignup) {
    return (
      <GuideTeacherForm
        onClose={() => setShowSignup(false)}
        onSuccess={() => {
          setShowSignup(false);
          toast.success('Registration successful! You can now login.');
        }}
        schoolId=""
        schoolName=""
        udiseCode=""
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-red-800"></div>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
              Guide Teacher Login
            </h2>
            <p className="text-gray-600">
              Sign in to manage your projects
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="udiseCode" className="block text-sm font-medium text-gray-700 mb-1">
                School UDISE Code
              </label>
              <div className="relative">
                <School className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="udiseCode"
                  value={udiseCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setUdiseCode(value);
                    setError('');
                  }}
                  className="pl-10 block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter 11-digit UDISE code"
                  required
                  maxLength={11}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Guide Teacher Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="pl-10 block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Not registered yet?{' '}
                <button
                  type="button"
                  onClick={() => setShowSignup(true)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Register as Guide Teacher
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}