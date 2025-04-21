


// import React from 'react';
// import { motion } from 'framer-motion';
// import {
//   Shield,
//   Users,
//   FileText,
//   CheckCircle,
//   AlertTriangle,
//   LogOut,
//   Settings,
//   Bell,
//   Search,
//   Filter,
//   Download,
//   Trash2,
//   Edit
// } from 'lucide-react';

// interface AdminDashboardProps {
//   onLogout: () => void;
// }

// export function AdminDashboard({ onLogout }: AdminDashboardProps) {
//   const stats = [
//     { title: 'Total Schools', value: '156', icon: Users, color: 'bg-blue-500' },
//     { title: 'Total Projects', value: '342', icon: FileText, color: 'bg-green-500' },
//     { title: 'Approved Projects', value: '187', icon: CheckCircle, color: 'bg-purple-500' },
//     { title: 'Pending Review', value: '45', icon: AlertTriangle, color: 'bg-yellow-500' }
//   ];

//   const recentProjects = [
//     { id: 1, title: 'Smart Agriculture System', school: 'St. Joseph School', status: 'approved' },
//     { id: 2, title: 'Waste Management Solution', school: 'Holy Cross School', status: 'pending' },
//     { id: 3, title: 'AI-based Learning Tool', school: 'Sacred Heart School', status: 'approved' },
//     { id: 4, title: 'Water Conservation Project', school: 'St. Mary School', status: 'pending' }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center">
//               <Shield className="h-8 w-8 text-purple-600" />
//               <div className="ml-4">
//                 <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
//                 <p className="text-sm text-gray-500">Welcome back, Vosa Tech</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
//                 <Bell className="h-6 w-6" />
//               </button>
//               <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
//                 <Settings className="h-6 w-6" />
//               </button>
//               <button
//                 onClick={onLogout}
//                 className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
//               >
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className="bg-white rounded-xl shadow-sm p-6"
//             >
//               <div className="flex items-center">
//                 <div className={`p-3 rounded-lg ${stat.color}`}>
//                   <stat.icon className="h-6 w-6 text-white" />
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm font-medium text-gray-500">{stat.title}</p>
//                   <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Projects Section */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
//               <div className="flex items-center space-x-4">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search projects..."
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                 </div>
//                 <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
//                   <Filter className="h-5 w-5" />
//                 </button>
//                 <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
//                   <Download className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Project
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     School
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {recentProjects.map((project) => (
//                   <tr key={project.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{project.title}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">{project.school}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         project.status === 'approved'
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div className="flex items-center space-x-3">
//                         <button className="text-blue-600 hover:text-blue-800">
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button className="text-red-600 hover:text-red-800">
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {Shield,Users, FileText,CheckCircle,AlertTriangle,LogOut,Settings,Bell,Search,Filter,Download,Trash2,Edit,Menu,School,UserCheck,ThumbsUp,ThumbsDown,UserX,ChevronRight,X} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface School {
  _id: string;
  schoolName: string;
  email: string;
  district: string;
  udiseCode: string;
  createdAt: string;
}

interface GuideTeacher {
  _id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  schoolName: string;
  verified: boolean;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  submissionDate: string;
  students: any[];
}

interface SchoolDetails {
  school: School;
  guideTeachers: GuideTeacher[];
  projects: Project[];
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('schools');
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<SchoolDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeMenu === 'schools') {
      fetchSchools();
    }
  }, [activeMenu]);

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:11129/api/admin/schools', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      setSchools(response.data);
      console.log(localStorage.getItem("token"));

      // console.log(schools,"schools")
      console.log(schools,"schools")
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Failed to fetch schools');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchoolDetails = async (schoolId: string) => {
    setIsLoading(true);
    try {
      const [schoolResponse, teachersResponse, projectsResponse] = await Promise.all([
        axios.get(`http://localhost:11129/api/admin/schools/${schoolId}`),
        axios.get(`http://localhost:11129/api/admin/guide-teachers/school/${schoolId}`),
        axios.get(`http://localhost:11129/api/admin/projects/school/${schoolId}`)
      ]);

      setSelectedSchool({
        school: schoolResponse.data,
        guideTeachers: teachersResponse.data,
        projects: projectsResponse.data
      });
    } catch (error) {
      console.error('Error fetching school details:', error);
      toast.error('Failed to fetch school details');
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { id: 'schools', name: 'School Details', icon: School },
    { id: 'evaluators', name: 'Evaluator Details', icon: UserCheck },
    { id: 'accepted', name: 'Accepted Projects', icon: ThumbsUp },
    { id: 'rejected', name: 'Rejected Projects', icon: ThumbsDown },
    { id: 'deleted', name: 'Deleted Schools', icon: UserX }
  ];

  const filteredSchools = schools.filter(school => 
    school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.udiseCode.includes(searchTerm)
  );

  const renderSchoolDashboard = () => {
    if (!selectedSchool) return null;

    const { school, guideTeachers, projects } = selectedSchool;
    const acceptedProjects = projects.filter(p => p.status === 'approved');
    const rejectedProjects = projects.filter(p => p.status === 'rejected');

    return (
      <div className="space-y-6">
        {/* School Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">School Name</p>
              <p className="font-medium">{school.schoolName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">UDISE Code</p>
              <p className="font-medium">{school.udiseCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{school.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">District</p>
              <p className="font-medium">{school.district}</p>
            </div>
          </div>
        </div>

        {/* Guide Teachers */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guide Teachers</h3>
          <div className="divide-y divide-gray-200">
            {guideTeachers.map(teacher => (
              <div key={teacher._id} className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{teacher.fullName}</p>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    teacher.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {teacher.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Accepted Projects */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted Projects</h3>
            <div className="divide-y divide-gray-200">
              {acceptedProjects.map(project => (
                <div key={project._id} className="py-4">
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rejected Projects */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejected Projects</h3>
            <div className="divide-y divide-gray-200">
              {rejectedProjects.map(project => (
                <div key={project._id} className="py-4">
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, Vosa Tech</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Drawer */}
        <div
          className={`fixed inset-y-0 left-0 transform ${
            isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out z-30`}
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <nav className="px-4 py-4 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      setSelectedSchool(null);
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                      activeMenu === item.id
                        ? 'text-red-800 bg-red-50'
                        : 'text-gray-600 hover:text-red-800 hover:bg-red-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${isDrawerOpen ? 'ml-64' : ''} transition-all duration-200 ease-in-out`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {selectedSchool ? (
              <div>
                <button
                  onClick={() => setSelectedSchool(null)}
                  className="mb-6 flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <ChevronRight className="h-4 w-4 mr-1 transform rotate-180" />
                  Back to Schools
                </button>
                {renderSchoolDashboard()}
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search schools..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full rounded-lg border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSchools.map((school) => (
                    <motion.div
                      key={school._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => fetchSchoolDetails(school._id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-red-50 rounded-lg">
                          <School className="h-6 w-6 text-red-800" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{school.schoolName}</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          UDISE: {school.udiseCode}
                        </p>
                        <p className="text-sm text-gray-500">
                          District: {school.district}
                        </p>
                        <p className="text-sm text-gray-500">
                          Email: {school.email}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

