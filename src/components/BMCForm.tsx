


import React, { useState } from 'react';
import { X, Loader, Upload, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface BMCFormProps {
  onClose: () => void;
  onSubmit: (data: BMCData) => void;
}

export interface BMCData {
  customerSegments: string;
  valuePropositions: string;
  channels: string;
  customerRelationships: string;
  revenueStreams: string;
  keyResources: string;
  keyActivities: string;
  keyPartners: string;
  cost: string;
}

const INITIAL_BMC_DATA: BMCData = {
  customerSegments: '',
  valuePropositions: '',
  channels: '',
  customerRelationships: '',
  revenueStreams: '',
  keyResources: '',
  keyActivities: '',
  keyPartners: '',
  cost: '',
};

const FIELD_DESCRIPTIONS = {
  customerSegments: 'Who are your target customers?',
  valuePropositions: 'What unique value do you offer to your customers?',
  channels: 'How do you reach and deliver value to your customers?',
  customerRelationships: 'How do you interact with customers and maintain relationships?',
  revenueStreams: 'How does your business generate revenue?',
  keyResources: 'What resources are essential to your business?',
  keyActivities: 'What key activities does your business perform?',
  keyPartners: 'Who are your key partners and suppliers?',
  cost: 'What are the main costs in your business model?'
};

export function BMCForm({ onClose, onSubmit }: BMCFormProps) {
  const [formData, setFormData] = useState<BMCData>(INITIAL_BMC_DATA);
  const [errors, setErrors] = useState<Partial<BMCData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Partial<BMCData> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key as keyof BMCData] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('BMC submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof BMCData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="relative group">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {key.split(/(?=[A-Z])/).join(' ')}
                </label>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onMouseEnter={() => setShowTooltip(key)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
              {showTooltip === key && (
                <div className="absolute z-10 w-64 px-4 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 right-8">
                  {FIELD_DESCRIPTIONS[key as keyof typeof FIELD_DESCRIPTIONS]}
                </div>
              )}
              <textarea
                value={value}
                onChange={(e) => handleChange(key as keyof BMCData, e.target.value)}
                className={`mt-1 block w-full rounded-lg shadow-sm text-sm
                  ${errors[key as keyof BMCData]
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } transition-all duration-200 ease-in-out`}
                rows={3}
                placeholder={FIELD_DESCRIPTIONS[key as keyof typeof FIELD_DESCRIPTIONS]}
              />
              {errors[key as keyof BMCData] && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[key as keyof BMCData]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </span>
            ) : (
              'Save and Continue'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}