import React, { useState } from 'react';
import { X, Loader, CheckCircle2, AlertCircle, School, Mail, MapPin, Lock, Hash } from 'lucide-react';
import axios from 'axios';

interface SignupFormProps {
  onClose: () => void;
  onSignupSuccess: (userData: any) => void;
}

const districts = [
  'Madurai',
  'Viruthunagar',
  'Thuthukudi',
  'Tirunelveli',
  'Kanyakumari',
  'Tenkasi'
];

const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push(`At least ${minLength} characters`);
  if (!hasUpperCase) errors.push('One uppercase letter');
  if (!hasLowerCase) errors.push('One lowercase letter');
  if (!hasNumbers) errors.push('One number');
  if (!hasSpecialChar) errors.push('One special character');

  return errors;
};

export function SignupForm({ onClose, onSignupSuccess }: SignupFormProps) {
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    district: '',
    udiseCode: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({
      ...formData,
      password: newPassword
    });
    setPasswordErrors(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.udiseCode.length !== 11) {
      setError('UDISE code must be exactly 11 digits');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:11129/api/auth/signup', {
        schoolName: formData.schoolName,
        email: formData.email,
        district: formData.district,
        udiseCode: formData.udiseCode,
        password: formData.password
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure the token is stored and retrieved correctly
        }
    });

      setSignupSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600">Your account has been created.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-800"></div>
        
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Create Account</h2>
          <p className="text-sm text-gray-500 mb-4">Register your school to participate</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center text-sm">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <School className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="School Name"
                  className="pl-10 w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
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
                />
              </div>

              <div className="relative">
                <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="udiseCode"
                  value={formData.udiseCode}
                  onChange={handleChange}
                  placeholder="11-digit UDISE Code"
                  className="pl-10 w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
                  pattern="[0-9]{11}"
                  maxLength={11}
                  title="Please enter your 11-digit UDISE code"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="pl-10 w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm appearance-none bg-white"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="Password"
                  className="pl-10 w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
                  minLength={8}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="pl-10 w-full py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {passwordErrors.length > 0 && (
              <div className="mt-2 text-sm text-red-600">
                <p className="font-medium">Password must contain:</p>
                <ul className="list-disc list-inside">
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}