/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import axiosPublic from "../../../utils/axiosPublic";

const DashboardDetails = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { number: 0, title: "Active Applications" },
    { number: 0, title: "Job Matches" },
    { number: 0, title: "Resources Matches" },
  ]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  const { user, setUser } = useAuth();

  // Fetch jobs and filter by user skills
  const fetchJobs = async () => {
    try {
      const res = await axiosPublic.get("/api/jobs");
      if (user) {
        const userSkills = user.skills || [];
        const matchedJobs = res.data
          .map((job) => {
            const matches = job.skills.filter((skill) =>
              userSkills.includes(skill)
            );
            return matches.length ? { ...job, matchSkills: matches } : null;
          })
          .filter(Boolean);

        setRecommendedJobs(matchedJobs);
        setStats((prev) => [
          { ...prev[0], number: user.recentApplications?.length || 0 },
          { ...prev[1], number: matchedJobs.length },
          prev[2],
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch learning resources based on user skills
  const fetchLearning = async () => {
    try {
      if (user && user.skills) {
        const res = await axiosPublic.get("/api/learning", {
          params: { skill: user.skills.join("|") },
        });
        setLearningResources(res.data);
        setStats((prev) => [
          prev[0],
          prev[1],
          { ...prev[2], number: res.data.length },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchLearning();
      setRecentApplications(user.recentApplications || []);
    }
  }, [user]);

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

      {/* Recommended Jobs, Recent Applications, Learning Resources */}
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
                <p className="text-gray-400 text-xs">
                  Matches: {job.matchSkills.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Recent Applications + Learning Resources */}
        <div className="space-y-6">
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

          {/* Recommended Learning Resources */}
         {/* Recommended Learning Resources */}
<div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
  <h3 className="text-xl font-bold mb-4 text-gray-800">Recommended Learning Resources</h3>
  <ul className="space-y-2">
    {learningResources.map((res, index) => {
      const matchedSkills = (res.skills || []).filter(skill =>
        (user.skills || []).includes(skill)
      );
      return (
        <li
          key={index}
          className="p-3 border rounded-lg hover:bg-[#0fb894] hover:text-white transition-colors duration-200 cursor-pointer"
        >
          <p className="font-semibold">{res.title}</p>
          <p className="text-gray-500 text-sm">{res.provider}</p>
          <p className="text-gray-400 text-xs">
            Matches: {matchedSkills.join(", ") || "None"}
          </p>
        </li>
      );
    })}
  </ul>
</div>

        </div>
      </div>
    </div>
  );
};

export default DashboardDetails;
