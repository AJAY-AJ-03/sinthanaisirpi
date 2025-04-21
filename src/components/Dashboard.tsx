


import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Mail, Download, UserPlus, LogIn, ChevronRight, 
  Calendar, Users, Trophy, FileText, CheckCircle, Bell, Settings,
  BarChart2, PieChart, TrendingUp, Clock, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GuideTeacherForm } from './GuideTeacherForm';
import { GuideTeacherLogin } from './GuideTeacherLogin';
import { IdeaSubmissionForm } from './IdeaSubmissionForm';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell
} from 'recharts';

interface DashboardProps {
  user: {
    school: {
      id: string;
      schoolName: string;
      email: string;
      district: string;
      udiseCode: string;
    };
    token: string;
  };
}

interface DashboardStats {
  totalProjects: number;
  totalGuideTeachers: number;
  approvedProjects: number;
}

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export function Dashboard({ user }: DashboardProps) {
  const [showGuideTeacherForm, setShowGuideTeacherForm] = useState(false);
  const [showGuideTeacherLogin, setShowGuideTeacherLogin] = useState(false);
  const [showIdeaSubmissionForm, setShowIdeaSubmissionForm] = useState(false);
  const [loggedInGuideTeacher, setLoggedInGuideTeacher] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalGuideTeachers: 0,
    approvedProjects: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [projectTrends] = useState([
    { name: 'Jan', projects: 4 },
    { name: 'Feb', projects: 7 },
    { name: 'Mar', projects: 12 },
    { name: 'Apr', projects: 15 },
    { name: 'May', projects: 18 },
  ]);

  const projectStatusData = [
    { name: 'Draft', value: 30 },
    { name: 'Under Review', value: 25 },
    { name: 'Approved', value: 35 },
    { name: 'Rejected', value: 10 },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      const [projectsResponse, teachersResponse] = await Promise.all([
        axios.get('http://localhost:11129/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:11129/api/guide-teachers', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const projects = projectsResponse.data;
      const approvedProjects = projects.filter((p: any) => p.status === 'approved').length;

      setStats({
        totalProjects: projects.length,
        totalGuideTeachers: teachersResponse.data.length,
        approvedProjects
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('http://localhost:11129/api/download/template');
      if (!response.ok) throw new Error('Failed to download template');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hackathon_template.pptx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Template downloaded successfully');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const handleGuideTeacherLoginSuccess = (teacherData: any) => {
    setLoggedInGuideTeacher(teacherData);
    setShowGuideTeacherLogin(false);
    setShowIdeaSubmissionForm(true);
    toast.success('Successfully logged in as guide teacher');
  };

  const handleIdeaSubmission = async (data: any) => {
    try {
      await fetchDashboardStats();
      toast.success('Project idea submitted successfully!');
      setShowIdeaSubmissionForm(false);
    } catch (error) {
      console.error('Error handling submission:', error);
      toast.error('Failed to update dashboard');
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white shadow-md">
        {/* School Info Section */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-red-700 to-red-900 p-3 rounded-xl shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{user.school.schoolName}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.school.email}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.school.district}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowGuideTeacherLogin(true)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Guide Teacher Login
                  </button>
                  <button
                    onClick={() => setShowGuideTeacherForm(true)}
                    className="inline-flex items-center px-4 py-2 border-2 border-red-700 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors duration-200"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register Guide Teacher
                  </button>
                  <button
                    onClick={handleDownloadTemplate}
                    className="inline-flex items-center px-4 py-2 border-2 border-red-700 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100">Total Projects</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.totalProjects}</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 text-indigo-100 text-sm">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  +12% from last month
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100">Guide Teachers</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.totalGuideTeachers}</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 text-emerald-100 text-sm">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Last added 2 days ago
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100">Approved Projects</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.approvedProjects}</h3>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 text-amber-100 text-sm">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  85% success rate
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loggedInGuideTeacher && showIdeaSubmissionForm ? (
          <IdeaSubmissionForm
            guideTeacher={loggedInGuideTeacher}
            onSubmit={handleIdeaSubmission}
            onBack={() => {
              setShowIdeaSubmissionForm(false);
              setLoggedInGuideTeacher(null);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Trends Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Project Trends</h3>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectTrends}>
                    <defs>
                      <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="projects"
                      stroke="#4F46E5"
                      fillOpacity={1}
                      fill="url(#colorProjects)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Project Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Project Status Distribution</h3>
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {projectStatusData.map((status, index) => (
                  <div key={status.name} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600">{status.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showGuideTeacherForm && (
        <GuideTeacherForm
          onClose={() => setShowGuideTeacherForm(false)}
          onSuccess={() => {
            setShowGuideTeacherForm(false);
            fetchDashboardStats();
            toast.success('Guide teacher registered successfully!');
          }}
          schoolId={user.school.id}
          schoolName={user.school.schoolName}
          udiseCode={user.school.udiseCode}
        />
      )}

      {showGuideTeacherLogin && (
        <GuideTeacherLogin
          onClose={() => setShowGuideTeacherLogin(false)}
          onLoginSuccess={handleGuideTeacherLoginSuccess}
        />
      )}
    </div>
  );
}