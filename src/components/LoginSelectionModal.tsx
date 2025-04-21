import React from 'react';
import { motion } from 'framer-motion';
import { X, School, Scale, Shield } from 'lucide-react';

interface LoginSelectionModalProps {
  onClose: () => void;
  onSelectLoginType: (type: 'school' | 'evaluator' | 'admin') => void;
}

export function LoginSelectionModal({ onClose, onSelectLoginType }: LoginSelectionModalProps) {
  const loginTypes = [
    {
      type: 'school' as const,
      title: 'School Login',
      description: 'Login for school administrators',
      icon: School,
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'evaluator' as const,
      title: 'Evaluator Login',
      description: 'Login for project evaluators',
      icon: Scale,
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'admin' as const,
      title: 'Admin Login',
      description: 'Login for system administrators',
      icon: Shield,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-800 to-red-900"></div>
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Select Login Type</h2>
          <p className="text-gray-600 text-center mb-8">Choose your role to continue</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loginTypes.map((loginType) => (
              <motion.button
                key={loginType.type}
                onClick={() => onSelectLoginType(loginType.type)}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${loginType.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <loginType.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{loginType.title}</h3>
                <p className="text-sm text-gray-600">{loginType.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}