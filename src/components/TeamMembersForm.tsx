import React from 'react';
import { motion } from 'framer-motion';
import { User, AlertCircle } from 'lucide-react';

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

interface TeamMembersFormProps {
  students: StudentDetails[];
  setStudents: (students: StudentDetails[]) => void;
  errors: Record<string, string>;
  teamSize: number;
}

const districts = [
  'Tenkasi',
  'Thoothukudi',
  'Kanyakumari',
  'Madurai',
  'Tirunelveli',
  'Viruthunagar'
];

export function TeamMembersForm({ students, setStudents, errors, teamSize }: TeamMembersFormProps) {
  return (
    <div className="space-y-8">
      {students.map((student, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-200 rounded-lg p-6 space-y-6"
        >
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-500" />
            Team Member {index + 1}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={student.name}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[index] = { ...student, name: e.target.value };
                  setStudents(newStudents);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors[`student${index}Name`] && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[`student${index}Name`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Father's Name</label>
              <input
                type="text"
                value={student.fatherName}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[index] = { ...student, fatherName: e.target.value };
                  setStudents(newStudents);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={student.dateOfBirth}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[index] = { ...student, dateOfBirth: e.target.value };
                  setStudents(newStudents);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors[`student${index}DOB`] && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[`student${index}DOB`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                value={student.gender}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[index] = { ...student, gender: e.target.value as 'male' | 'female' | 'other' };
                  setStudents(newStudents);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Community</label>
              <select
                value={student.community}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[index] = { ...student, community: e.target.value as StudentDetails['community'] };
                  setStudents(newStudents);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {['BC', 'MBC', 'ST', 'SC', 'General'].map(comm => (
                  <option key={comm} value={comm}>{comm}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">District</label>
              <select
                value={student.district}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[index] = { ...student, district: e.target.value };
                  setStudents(newStudents);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors[`student${index}District`] && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[`student${index}District`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Standard</label>
              <input
                type="text"
                value={student.standard}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[index] = { ...student, standard: e.target.value };
                  setStudents(newStudents);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors[`student${index}Standard`] && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[`student${index}Standard`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">School Name</label>
              <input
                type="text"
                value={student.school}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[index] = { ...student, school: e.target.value };
                  setStudents(newStudents);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors[`student${index}School`] && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[`student${index}School`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={student.email}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[index] = { ...student, email: e.target.value };
                  setStudents(newStudents);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors[`student${index}Email`] && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[`student${index}Email`]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                value={student.contactNumber}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[index] = { ...student, contactNumber: e.target.value.replace(/\D/g, '').slice(0, 10) };
                  setStudents(newStudents);
                }}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                maxLength={10}
              />
              {errors[`student${index}Contact`] && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors[`student${index}Contact`]}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}