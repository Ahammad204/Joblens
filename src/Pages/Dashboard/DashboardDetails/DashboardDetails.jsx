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
  // NEW STATE: To store resources recommended for a skill gap
  const [skillGapRecommendations, setSkillGapRecommendations] = useState({}); // { jobId: [{resource}] }
  const { user, setUser } = useAuth();

  // Helper function to fetch learning resources for a specific job's skill gap
  const fetchSkillGapResources = async (jobId, missingSkills) => {
    if (missingSkills.length === 0) return;

    try {
      const res = await axiosPublic.post(
        "/api/jobs/skill-gap-recommendations",
        { missingSkills: missingSkills }
      );
      setSkillGapRecommendations(prev => ({
        ...prev,
        [jobId]: res.data.slice(0, 3) // Store up to 3 resources per job
      }));
    } catch (err) {
      console.error(`Error fetching skill gap resources for ${jobId}:`, err);
    }
  };

  // Fetch jobs using the new recommendation endpoint
  const fetchJobs = async () => {
    try {
      const res = await axiosPublic.get("/api/jobs/recommend");

      if (user) {
        const recommendedJobsWithScores = res.data;

        setRecommendedJobs(recommendedJobsWithScores);
        setStats((prev) => [
          { ...prev[0], number: user.recentApplications?.length || 0 },
          { ...prev[1], number: recommendedJobsWithScores.length },
          prev[2],
        ]);
        
        // NEW LOGIC: Fetch resources for skill gaps in partial matches (e.g., match < 80%)
        recommendedJobsWithScores.forEach(job => {
            if (job.matchPercentage < 80 && job.missingSkills && job.missingSkills.length > 0) {
                // Pass the job's MongoDB ID as a key
                fetchSkillGapResources(job._id, job.missingSkills); 
            }
        });
      }
    } catch (err) {
      console.error("Error fetching recommended jobs:", err);
    }
  };

  // Fetch learning resources based on user skills
  const fetchLearning = async () => {
    try {
      if (user && user.skills) {
        // NOTE: Using the original endpoint for user's existing skills recommendation
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
      console.error("Error fetching learning resources:", err);
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
        {/* Recommended Jobs (UPDATED DISPLAY) */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Recommended Jobs</h3>
          <ul className="space-y-3">
            {recommendedJobs.map((job, index) => {
                const isPartialMatch = job.matchPercentage < 80 && job.missingSkills?.length > 0;
                const gapResources = skillGapRecommendations[job._id];

                return (
              <li
                key={index}
                className="p-4 border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-[#0fb894]/80"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-lg text-gray-800">
                    {job.title} at {job.company}
                  </p>
                  <span className={`text-white font-bold text-sm px-3 py-1 rounded-full whitespace-nowrap ${job.matchPercentage > 70 ? 'bg-green-600' : job.matchPercentage > 50 ? 'bg-yellow-600' : 'bg-gray-500'}`}>
                    {job.matchPercentage}% Match
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2 font-medium">
                  Key Reasons:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-sm text-gray-500 ml-2">
                  {/* Displaying reasons, using dangerouslySetInnerHTML to render bold text from the backend */}
                  {job.keyReasons.slice(0, 3).map((reason, rIndex) => (
                    <li
                      key={rIndex}
                      dangerouslySetInnerHTML={{
                        __html: reason.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"),
                      }}
                    />
                  ))}
                </ul>

                {/* NEW FEATURE: Skill Gap and Resource Recommendation for Partial Matches */}
                {isPartialMatch && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-bold text-red-700 mb-1">
                            ⚠️ Skill Gap Identified
                        </p>
                        <p className="text-xs text-red-600 mb-2">
                            Missing Skills: <span className="font-semibold">{job.missingSkills.join(", ")}</span>
                        </p>
                        {gapResources?.length > 0 && (
                            <>
                                <p className="text-xs font-bold text-red-700 mb-1">
                                    Recommended Learning Resources:
                                </p>
                                <ul className="list-disc list-inside space-y-0.5 text-xs text-red-500 ml-2">
                                    {gapResources.map((res, rIndex) => (
                                        <li key={rIndex}>
                                            <a 
                                                href={res.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="hover:underline font-medium"
                                            >
                                                {res.title}
                                            </a> 
                                            <span className="text-red-400"> (Covers: {res.relevantMissingSkills.join(", ")})</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {gapResources?.length === 0 && (
                            <p className="text-xs text-red-600 italic">No specific learning resources found for this gap yet.</p>
                        )}
                    </div>
                )}
                {/* END NEW FEATURE */}

                {/* External Platforms Links */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Check/Apply on:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.platforms && job.platforms.map((platform, pIndex) => (
                      <a
                        key={pIndex}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors duration-150"
                      >
                        {platform.name}
                      </a>
                    ))}
                  </div>
                </div>
              </li>
            );
            })}
            {recommendedJobs.length === 0 && (
                <li className="p-4 text-center text-gray-500 italic">No strong job matches found. Complete your profile for better results!</li>
            )}
          </ul>
        </div>
        {/* Right Column: Recent Applications + Learning Resources */}
        <div className="space-y-6">
          {/* Recent Applications (UNCHANGED) */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Recent Applications
            </h3>
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
          {/* Recommended Learning Resources (UNCHANGED) */}
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Recommended Learning Resources
            </h3>
            <ul className="space-y-2">
              {learningResources.map((res, index) => {
                const matchedSkills = (res.relatedSkills || []).filter(
                  (skill) => (user?.skills || []).includes(skill)
                );
                return (
                  <li
                    key={index}
                    className="p-3 border rounded-lg hover:bg-[#0fb894] hover:text-white transition-colors duration-200 cursor-pointer"
                  >
                    <p className="font-semibold">{res.title}</p>
                    <p className="text-gray-500 text-sm">{res.platform}</p>
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