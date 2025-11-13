import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardDetails = () => {
  const navigate = useNavigate();

  // Dummy data for stats
  const stats = [
    { number: 12, title: "Active Applications" },
    { number: 5, title: "Job Matches" },
    { number: 3, title: "Learning in Progress" },
  ];

  // Dummy data for lists
  const recommendedJobs = [
    { title: "Frontend Developer", company: "TechCorp" },
    { title: "Data Analyst", company: "DataSolutions" },
  ];

  const recentApplications = [
    { title: "UI/UX Designer", company: "DesignPro" },
    { title: "Backend Developer", company: "WebWorks" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Profile Completion Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Complete your profile
        </h2>
        <p className="text-gray-600 mb-6">
          Add your skills and preferences to get personalized job recommendations!
        </p>
        <button
          onClick={() => navigate("/dashboard/userprofile")}
          className="bg-[#0fb894] text-white px-6 py-2 rounded-lg cursor-pointer font-semibold hover:bg-green-500 transition-colors duration-200"
        >
          Go to Profile
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="text-3xl font-bold text-[#0fb894] mr-4">{stat.number}</div>
            <div className="text-gray-700 font-semibold text-lg">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Recommended Jobs and Recent Applications */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recommended Jobs */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Recommended Jobs</h3>
          <ul className="space-y-2">
            {recommendedJobs.map((job, index) => (
              <li
                key={index}
                className="p-3 border rounded-lg hover:bg-[#0fb894] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <p className="font-semibold">{job.title}</p>
                <p className="text-gray-500 text-sm">{job.company}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Applications */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Applications</h3>
          <ul className="space-y-2">
            {recentApplications.map((app, index) => (
              <li
                key={index}
                className="p-3 border rounded-lg hover:bg-[#0fb894] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <p className="font-semibold">{app.title}</p>
                <p className="text-gray-500 text-sm">{app.company}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardDetails;
