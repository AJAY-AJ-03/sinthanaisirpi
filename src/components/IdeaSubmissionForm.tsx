import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Mail, Phone, School, MapPin, Upload, AlertCircle, CheckCircle, FileText, X, Loader, Check,Download} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BMCForm, BMCData } from './BMCForm';
import { TeamMembersForm } from './TeamMembersForm';

interface StudentDetails {
  name: string;
  fatherName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  community: 'BC' | 'MBC' | 'ST' | 'SC' | 'General';
  district: string;
  standard: string;
  school: string;
  email: string;
  contactNumber: string;
}

interface IdeaSubmissionFormProps {
  guideTeacher: {
    id: string;
    fullName: string;
    email: string;
    contactNumber: string;
  };
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const initialStudentDetails: StudentDetails = {
  name: '',
  fatherName: '',
  dateOfBirth: '',
  gender: 'male',
  community: 'General',
  district: '',
  standard: '',
  school: '',
  email: '',
  contactNumber: ''
};

const districts = [
  'Tenkasi',
  'Thoothukudi',
  'Kanyakumari',
  'Madurai',
  'Tirunelveli',
  'Viruthunagar'
];

const steps = [
  { id: 'details', name: 'Project Details', icon: FileText },
  { id: 'team', name: 'Team Members', icon: User },
  { id: 'bmc', name: 'Business Model Canvas', icon: Calendar },
  { id: 'files', name: 'Project Files', icon: Upload }
];

export function IdeaSubmissionForm({ guideTeacher, onSubmit, onBack }: IdeaSubmissionFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamSize, setTeamSize] = useState(1);
  const [students, setStudents] = useState<StudentDetails[]>([{
    ...initialStudentDetails,
    school: ''
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [projectFiles, setProjectFiles] = useState<{ name: string; url: string }[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bmcData, setBmcData] = useState<BMCData | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const newStudents = Array(teamSize).fill(null).map((_, index) => 
      students[index] || { ...initialStudentDetails, school: '' }
    );
    setStudents(newStudents);
  }, [teamSize]);

  const validateProjectDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Project title is required';
    if (!description.trim()) newErrors.description = 'Project description is required';
    if (teamSize < 1 || teamSize > 5) newErrors.teamSize = 'Team size must be between 1 and 5';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTeamMembers = () => {
    const newErrors: Record<string, string> = {};
    students.forEach((student, index) => {
      if (!student.name.trim()) newErrors[`student${index}Name`] = 'Student name is required';
      if (!student.email.trim()) newErrors[`student${index}Email`] = 'Email is required';
      if (!student.contactNumber.trim()) newErrors[`student${index}Contact`] = 'Contact number is required';
      if (!student.district) newErrors[`student${index}District`] = 'District is required';
      if (!student.dateOfBirth) newErrors[`student${index}DOB`] = 'Date of birth is required';
      if (!student.standard.trim()) newErrors[`student${index}Standard`] = 'Standard is required';
      if (!student.school.trim()) newErrors[`student${index}School`] = 'School name is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProjectDetailsSubmit = async () => {
    if (!validateProjectDetails()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      let response;
      const projectData = {
        title,
        description,
        teamSize,
        guideTeacher: {
          id: guideTeacher.id,
          name: guideTeacher.fullName,
          email: guideTeacher.email,
          contactNumber: guideTeacher.contactNumber
        },
        status: 'draft'
      };

      if (projectId) {
        response = await axios.put(
          `http://localhost:11129/api/projects/${projectId}`,
          projectData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        response = await axios.post(
          'http://localhost:11129/api/projects',
          projectData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setProjectId(response.data.project._id);
      }

      setCompletedSteps([...completedSteps, 0]);
      toast.success('Project details saved successfully!');
      setActiveStep(1);
    } catch (error: any) {
      console.error('Project submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save project details';
      toast.error(errorMessage);

      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
        localStorage.removeItem('token');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeamMembersSubmit = async () => {
    if (!validateTeamMembers()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!projectId) {
      toast.error('Project ID not found. Please try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      await axios.put(
        `http://localhost:11129/api/projects/${projectId}`,
        { 
          students: students.map(student => ({
            name: student.name,
            fatherName: student.fatherName,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
            community: student.community,
            district: student.district,
            standard: student.standard,
            school: student.school,
            email: student.email,
            contactNumber: student.contactNumber
          }))
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setCompletedSteps([...completedSteps, 1]);
      toast.success('Team members saved successfully!');
      setActiveStep(2);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save team members');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBMCSubmit = async (data: BMCData) => {
    if (!projectId) {
      toast.error('Project ID not found. Please try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      await axios.put(
        `http://localhost:11129/api/projects/${projectId}`,
        { businessModelCanvas: data },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setBmcData(data);
      setCompletedSteps([...completedSteps, 2]);
      toast.success('Business Model Canvas saved successfully!');
      setActiveStep(3);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save BMC');
    } finally {
      setIsSubmitting(false);
    }
  };

  

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
  
    // Check if file is .pptx
    if (!file.name.endsWith('.pptx')) {
      toast.error('Only .pptx files are allowed');
      e.target.value = '';
      return;
    }
  
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');
  
      // Convert file to Base64
      const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
  
      const base64File = await toBase64(file);
  
      const newFile = { name: file.name, base64: base64File }; // Store Base64
  
      await axios.post(
        `http://localhost:11129/api/projects/${projectId}/files`,
        newFile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      setProjectFiles([...projectFiles, { name: file.name, url: base64File }]); // Store locally
      toast.success('File uploaded successfully');
      e.target.value = '';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };
  

  const handleRemoveFile = async (index: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !projectId) throw new Error('Authentication token not found');

      const updatedFiles = projectFiles.filter((_, i) => i !== index);
      
      await axios.put(
        `http://localhost:11129/api/projects/${projectId}`,
        { projectFiles: updatedFiles },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setProjectFiles(updatedFiles);
      toast.success('File removed successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove file');
    }
  };

  const handleFinalSubmit = async () => {
    if (!projectId) {
      toast.error('Project ID not found. Please try again.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      await axios.put(
        `http://localhost:11129/api/projects/${projectId}`,
        { status: 'submitted' },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setShowSuccessModal(true);
      setTimeout(() => {
        onSubmit({ projectId });
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit project');
    }
  };

  if (showSuccessModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Submitted!</h2>
          <p className="text-gray-600 mb-6">Your project has been successfully submitted for review.</p>
          <div className="w-full h-2 bg-green-500 rounded-full" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 bg-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Submit Project Idea</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Guide Teacher: {guideTeacher.fullName}
                </p>
              </div>
              <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-8 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isCurrent = activeStep === index;
                return (
                  <div
                    key={step.id}
                    className={`relative flex flex-col items-center ${
                      index < activeStep ? 'text-red-800' : 
                      isCurrent ? 'text-red-800' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        isCompleted ? 'bg-red-800' :
                        isCurrent ? 'border-2 border-red-800 bg-white' :
                        'border-2 border-gray-300 bg-white'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <step.icon className={`w-5 h-5 ${isCurrent ? 'text-red-800' : 'text-gray-400'}`} />
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium">{step.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6">
            {activeStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter your project title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Describe your project idea in detail"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Team Size</label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {[1, 2, 3, 4, 5].map(size => (
                      <option key={size} value={size}>{size} Member{size > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleProjectDetailsSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save and Continue'
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-8">
                <TeamMembersForm
                  students={students}
                  setStudents={setStudents}
                  errors={errors}
                  teamSize={teamSize}
                />

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep(0)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleTeamMembersSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save and Continue'
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <BMCForm
                onClose={() => setActiveStep(1)}
                onSubmit={handleBMCSubmit}
              />
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-red-800 hover:text-red-700"
                      >
                        <span>Upload project files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileUpload}
                          accept=".pptx"
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Only .pptx files are allowed</p>
                  </div>
                </div>

                {projectFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Uploaded Files</h4>
                    <ul className="divide-y divide-gray-200">
                      {projectFiles.map((file, index) => (
                        <li key={index} className="py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting || projectFiles.length === 0}
                    className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Project'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}