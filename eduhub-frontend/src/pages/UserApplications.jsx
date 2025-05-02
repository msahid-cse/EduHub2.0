import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Briefcase } from 'lucide-react';
import UserJobApplications from '../components/UserJobApplications';

const UserApplications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Job Applications</h1>
            <p className="text-gray-400">
              Track the status of your job applications and feedback
            </p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center text-teal-400 hover:text-teal-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-gray-800 p-5 rounded-xl h-fit">
            <h2 className="text-lg font-medium text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/jobs')} 
                className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-teal-400" />
                  Browse Jobs
                </span>
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </button>
              
              <button
                onClick={() => navigate('/job-search-by-cv')} 
                className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-teal-400" />
                  CV Job Search
                </span>
                <ChevronLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <UserJobApplications />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserApplications; 