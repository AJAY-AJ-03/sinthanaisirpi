



import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader, Save, X, Download, Eye } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AcceptedProjectsProps {
  onClose: () => void;
}

interface EvaluatorScore {
  score?: number;
  reason?: string;
  evaluatedAt?: Date;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  schoolId: {
    schoolName: string;
    udiseCode: string;
  };
  evaluatorScores: Record<string, EvaluatorScore>;
  status: string;
  projectFiles: { name: string; base64: string }[];
}

export function AcceptedProjects({ onClose }: AcceptedProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});
  const evaluatorNumber = localStorage.getItem('evaluatorNumber');

  useEffect(() => {
    fetchAcceptedProjects();
  }, []);

  const fetchAcceptedProjects = async () => {
    try {
      const token = localStorage.getItem('evaluatorToken');
      console.log(token,"token")
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('http://localhost:11129/api/evaluators/accepted-projects', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching accepted projects:', error);
      toast.error('Failed to fetch accepted projects');
    } finally {
      setIsLoading(false);
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

  const handleScoreSubmit = async (projectId: string, score: number) => {
    
    const evaluatorNumber = localStorage.getItem('evaluatorNumber');
    console.log(evaluatorNumber,"evaluatorNumber")
    console.log(localStorage.getItem('evaluatorNumber'));

    if (!evaluatorNumber) {
      toast.error('Evaluator not found');
      return;
    }
  
    const token = localStorage.getItem('evaluatorToken');
    console.log(token,"token")

    if (!token) {
      toast.error('Unauthorized: No token found');
      return;
    }
  
    setIsSaving(prev => ({ ...prev, [projectId]: true }));
    
    console.log(isSaving,"isSaving")


  
    try {
      console.log("Submitting Score for:", projectId);
      console.log("Token:", token);
      console.log("Payload:", { score, reason: "Updated score", status: "accepted" });
  
      const response = await axios.post(
        `http://localhost:11129/api/evaluators/evaluate/${projectId}`,
        { score, reason: "Updated score", status: "Evaluated" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("API Response:", response.data);
      
  
      if (response.data?.project) {
        setProjects(prevProjects =>
          prevProjects.map(p =>
            p._id === projectId
              ? {
                  ...p,
                  evaluatorScores: {
                    ...p.evaluatorScores,
                    [`evaluator${evaluatorNumber}`]: {
                      ...p.evaluatorScores[`evaluator${evaluatorNumber}`],
                      score: response.data.project.evaluatorScores[`evaluator${evaluatorNumber}`]?.score || 0
                    }
                  }
                }
              : p
          )
        );
        
      } else {
        toast.error(response.data?.message || 'Failed to save score');
      }
      
    } catch (error) {
      console.error('Error saving score:', error);
      toast.error(error.response?.data?.message || 'Failed to save score');
    } finally {
      setIsSaving(prev => ({ ...prev, [projectId]: false }));
    }
  };
  

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <Loader className="w-8 h-8 animate-spin text-red-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading accepted projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-0 mx-auto p-5 w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Accepted Projects</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No accepted projects</h3>
                <p className="text-gray-500">There are no accepted projects to display.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((project) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg border p-6"
                  >
                    <div className="flex justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                      <span className="text-sm text-gray-600">
                        School: {project.schoolId?.schoolName || 'N/A'}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{project.description}</p>

                    <div className="space-y-4 mb-4">
                      {project.projectFiles?.map((file, index) => (
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

                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        defaultValue={project.evaluatorScores[`evaluator${evaluatorNumber}`]?.score || 0}
                        onChange={(e) => {
                          const newScore = parseInt(e.target.value, 10);
                          if (!isNaN(newScore)) {
                            handleScoreSubmit(project._id, newScore);
                          }
                        }}
                        className="w-24 px-2 py-1 border rounded"
                      />
                      <button
                        onClick={() => handleScoreSubmit(project._id, project.evaluatorScores[`evaluator${evaluatorNumber}`]?.score || 0)}
                        disabled={isSaving[project._id]}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {isSaving[project._id] ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>Save Score</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}