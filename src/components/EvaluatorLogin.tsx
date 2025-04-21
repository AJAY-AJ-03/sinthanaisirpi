
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader, AlertCircle, User, Lock, Scale } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface EvaluatorLoginProps {
  onClose: () => void;
  onLoginSuccess: (evaluatorData: { token: string; evaluator: any }) => void;
}

export function EvaluatorLogin({ onClose, onLoginSuccess }: EvaluatorLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:11129/api/evaluators/login', {
        username,
        password
      });

      const { token, evaluator } = response.data;

      if (!token || !evaluator) {
        throw new Error('Invalid response from server');
      }

      // ✅ Store token, evaluator data, and evaluatorNumber
      localStorage.setItem('evaluatorToken', token);
      localStorage.setItem('evaluatorData', JSON.stringify(evaluator));
      localStorage.setItem('evaluatorNumber', String(evaluator.evaluatorNumber)); // ✅ Store evaluatorNumber

      toast.success('Login successful!');
      onLoginSuccess({ token, evaluator });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);
      toast.error(errorMessage);

      // Clear stored credentials on error
      localStorage.removeItem('evaluatorToken');
      localStorage.removeItem('evaluatorData');
      localStorage.removeItem('evaluatorNumber'); // ✅ Remove evaluatorNumber if login fails
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-800"></div>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                <Scale className="h-8 w-8 text-red-800" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Evaluator Login</h2>
            <p className="text-gray-600">Sign in to evaluate projects</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-800 focus:border-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-red-800 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
