


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Download, Eye, Loader, LogOut, School, FileCheck, Search,
  RefreshCw, Building2, ThumbsUp, ThumbsDown, X, Save
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AcceptedProjects } from './AcceptedProjects';

interface EvaluatorDashboardProps {
  evaluator: {
    id: string;
    username: string;
    evaluatorNumber: number;
  };
  onLogout: () => void;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  schoolId: {
    _id: string;
    schoolName: string;
    udiseCode: string;
  };
  projectFiles: Array<{
    name: string;
    base64: string;
  }>;
  status: string;
  evaluatorScores: {
    [key: string]: {
      score?: number;
      reason?: string;
      evaluatedAt?: Date;
    };
  };
  evaluatorStatus: {
    evaluator1?: 'pending' | 'accepted' | 'rejected';
    evaluator2?: 'pending' | 'accepted' | 'rejected';
    evaluator3?: 'pending' | 'accepted' | 'rejected';
  };
}

export function EvaluatorDashboard({ evaluator, onLogout }: EvaluatorDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [evaluationReason, setEvaluationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showAcceptedProjects, setShowAcceptedProjects] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsRefreshing(true);
      const token = localStorage.getItem('evaluatorToken');
      const response = await axios.get('http://localhost:11129/api/evaluators/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data,"data")

      const assignedProjects = response.data.filter((project: Project) => {
        const evaluatorKey = `evaluator${evaluator.evaluatorNumber}`;
        return project.evaluatorStatus?.[evaluatorKey] !== undefined;
      });

      setProjects(assignedProjects);
      toast.success('Projects loaded successfully');
    } catch (error) {
      console.error('Fetch Projects Error:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleFileAction = (base64: string, action: 'open' | 'download', fileName: string) => {
    if (!base64) {
      toast.error('File data is missing');
      return;
    }

    try {
      const base64Data = base64.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const url = URL.createObjectURL(blob);

      if (action === 'open') {
        window.open(url, '_blank');
      } else if (action === 'download') {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'document.pptx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Failed to process file');
    }
  };

  const submitEvaluation = async (projectId: string, score: number, reason: string, status: 'accepted' | 'rejected') => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('evaluatorToken');
      await axios.post(
        `http://localhost:11129/api/evaluators/evaluate/${projectId}`,
        { score, reason, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Evaluation submitted successfully');
      setShowEvaluationModal(false);
      setSelectedProject(null);
      setEvaluationReason('');
      await fetchProjects();
    } catch (error) {
      console.error('Evaluation submission error:', error);
      toast.error('Failed to submit evaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (!project?.title || !project?.schoolId?.schoolName) return false;
    return (
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.schoolId.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const EvaluationModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Evaluate Project</h3>
          <button
            onClick={() => setShowEvaluationModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Reason</label>
            <textarea
              value={evaluationReason}
              onChange={(e) => setEvaluationReason(e.target.value)}
              className="w-full rounded-lg border-gray-300"
              rows={4}
              placeholder="Enter your evaluation reason..."
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => selectedProject?._id && submitEvaluation(selectedProject._id, 1, evaluationReason, 'accepted')}
              disabled={isSubmitting || !evaluationReason.trim()}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Accept
            </button>
            <button
              onClick={() => selectedProject?._id && submitEvaluation(selectedProject._id, 0, evaluationReason, 'rejected')}
              disabled={isSubmitting || !evaluationReason.trim()}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-red-800" />
      </div>
    );
  }

  if (showAcceptedProjects) {
    return <AcceptedProjects onClose={() => setShowAcceptedProjects(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <School className="h-8 w-8 text-red-800" />
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">Evaluator Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {evaluator.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAcceptedProjects(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                <FileCheck className="w-4 h-4 inline-block mr-2" />
                Accepted Projects
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                <LogOut className="w-4 h-4 inline-block mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300"
              />
            </div>
            <button
              onClick={fetchProjects}
              className={`p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : project.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="w-4 h-4 mr-1" />
                    {project.schoolId.schoolName}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                <div className="space-y-2 mb-4">
                  {project.projectFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600 truncate">{file.name}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFileAction(file.base64, 'open', file.name)}
                          className="p-1 text-gray-500 hover:text-red-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFileAction(file.base64, 'download', file.name)}
                          className="p-1 text-gray-500 hover:text-red-600"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setShowEvaluationModal(true);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Evaluate Project
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'All projects have been evaluated'}
            </p>
          </div>
        )}
      </div>

      {showEvaluationModal && <EvaluationModal />}
    </div>
  );
}