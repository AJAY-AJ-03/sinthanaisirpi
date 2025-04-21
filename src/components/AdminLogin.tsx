import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader, AlertCircle, Shield, Lock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AdminLoginProps {
  onClose: () => void;
  onLoginSuccess: (adminData: any) => void;
}

export function AdminLogin({ onClose, onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { username , password }); // Debug log

      const response = await axios.post('http://localhost:11129/api/admin/login', {
        username,
        password
      });

      console.log('Login response:', response); // Debug log

      const { token, admin } = response.data;

      console.log(token,"token")

      if (!token || !admin) {
        throw new Error('Invalid response from server');
      }

      // Store admin data and token in localStorage
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(admin));

      toast.success('Login successful!');
      onLoginSuccess(admin);
    } catch (err: any) {
      console.error('Login error:', err); // Debug log
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);
      toast.error(errorMessage);

      // Clear stored credentials on error
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-50 rounded-full">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Login
            </h2>
            <p className="text-gray-600">
              Sign in to access admin dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
          </form>
        </div>
      </motion.div>
    </div>
  );
}