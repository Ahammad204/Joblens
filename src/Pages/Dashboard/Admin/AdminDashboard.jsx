import React, { useEffect, useState } from "react";
import { FaUsers, FaBriefcase, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import axiosPublic from "../../../utils/axiosPublic";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axiosPublic.get("/api/admin/analytics");
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-xl animate-pulse">Loading...</div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Top Analytics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <FaUsers size={40} />
          <div>
            <h2 className="text-lg font-semibold">Users Analyzed</h2>
            <p className="text-2xl font-bold">{analytics.usersAnalyzed}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <FaBriefcase size={40} />
          <div>
            <h2 className="text-lg font-semibold">Jobs Suggested</h2>
            <p className="text-2xl font-bold">{analytics.jobsSuggested}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <FaChartLine size={40} />
          <div>
            <h2 className="text-lg font-semibold">Most In-Demand Skills</h2>
            <p className="text-2xl font-bold">{analytics.mostInDemandSkills.length}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <FaExclamationTriangle size={40} />
          <div>
            <h2 className="text-lg font-semibold">Skill Gaps</h2>
            <p className="text-2xl font-bold">{analytics.commonGaps.length}</p>
          </div>
        </div>
      </div>

      {/* Detailed Lists */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Most In-Demand Skills</h2>
          <ul className="space-y-2">
            {analytics.mostInDemandSkills.map((s) => (
              <li key={s.skill} className="flex justify-between bg-gray-50 p-3 rounded-md shadow-sm">
                <span>{s.skill}</span>
                <span className="font-semibold text-gray-800">{s.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Common Skill Gaps</h2>
          <ul className="space-y-2">
            {analytics.commonGaps.map((skill) => (
              <li key={skill} className="bg-red-50 p-3 rounded-md shadow-sm text-red-700">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
