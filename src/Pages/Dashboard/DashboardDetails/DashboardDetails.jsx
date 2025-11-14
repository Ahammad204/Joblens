/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import axiosPublic from "../../../utils/axiosPublic";
import toast from "react-hot-toast";

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
  const [skillGapRecommendations, setSkillGapRecommendations] = useState({});
  const { user, setUser } = useAuth();


  const [roadmap, setRoadmap] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapInput, setRoadmapInput] = useState({
    targetRole: "", // e.g., 'Frontend Developer'
    timeframe: "3 Months",
    learningTime: "10 hours per week",
  });
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
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
  const fetchRoadmap = async () => {
    try {
      const res = await axiosPublic.get("/api/roadmap");
      setRoadmap(res.data);
    } catch (err) {
      console.log("No existing roadmap found or error fetching.");
      setRoadmap(null); // Clear roadmap if not found
    }
  };

  const generateRoadmap = async () => {
    setIsGenerating(true);
    try {
      if (!user?.skills || user.skills.length === 0) {
        alert("Please complete your profile with skills before generating a roadmap!");
        setIsGenerating(false);
        return;
      }
      
      const payload = {
        ...roadmapInput,
        currentSkills: user.skills,
      };

      const res = await axiosPublic.post("/api/roadmap/generate", payload);
      setRoadmap(res.data);
      setIsInputModalOpen(false); // Close modal on success
      toast.success("Roadmap generated successfully!");
      
    } catch (err) {
      console.error("Error generating roadmap:", err);
      toast.error("Failed to generate roadmap. Please check the console for details.");
    } finally {
      setIsGenerating(false);
    }
  };
useEffect(() => {
  if (user) {
   fetchJobs();
   fetchLearning();
   setRecentApplications(user.recentApplications || []);
      // NEW: Fetch existing roadmap on load
      fetchRoadmap(); 
  }
 }, [user]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Roadmap Card (MODIFIED SECTION) */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {roadmap ? "Your Personalized Roadmap" : "Generate Your Career Roadmap"}
        </h2>
        <p className="text-gray-600 mb-6">
          {roadmap 
            ? `Roadmap for **${roadmap.targetRole}** over **${roadmap.timeframe}** is ready. Check your progress, or generate a new one!`
            : "Use AI to create a tailored, step-by-step learning plan to land your dream job."}
        </p>

        <div className="flex justify-center space-x-4">
          {roadmap && (
            // 1. View Roadmap Button (Visible if roadmap exists)
            <button
              onClick={() => navigate("/dashboard/roadmap")}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg cursor-pointer font-semibold hover:bg-purple-700 transition-colors duration-200"
              disabled={isGenerating}
            >
              View Current Roadmap
            </button>
          )}

          {/* 2. Generate Roadmap Button:
            - If a roadmap exists, this button opens the input modal to create a new one.
            - If no roadmap exists, this is the main button to start the process.
          */}
          <button
            onClick={() => setIsInputModalOpen(true)}
            className={`px-6 py-2 rounded-lg cursor-pointer font-semibold transition-colors duration-200 ${
              isGenerating
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : roadmap
                  ? 'bg-blue-500 text-white hover:bg-blue-600' // Different color for 'Generate New'
                  : 'bg-purple-600 text-white hover:bg-purple-700' // Original color for 'Generate'
            }`}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : roadmap ? "Generate New Roadmap" : "Generate Roadmap"}
          </button>
        </div>
      </div>
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
      {isInputModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Configure Roadmap</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                <input
                  type="text"
                  placeholder="e.g., Frontend Developer, Data Analyst"
                  value={roadmapInput.targetRole}
                  onChange={(e) => setRoadmapInput({...roadmapInput, targetRole: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0fb894] focus:border-[#0fb894]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                <select
                  value={roadmapInput.timeframe}
                  onChange={(e) => setRoadmapInput({...roadmapInput, timeframe: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0fb894] focus:border-[#0fb894]"
                >
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Learning Time (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., 5 hours per week or 2 hours per day"
                  value={roadmapInput.learningTime}
                  onChange={(e) => setRoadmapInput({...roadmapInput, learningTime: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0fb894] focus:border-[#0fb894]"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsInputModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={generateRoadmap}
                disabled={isGenerating || !roadmapInput.targetRole}
                className={`px-4 py-2 text-white rounded-lg font-semibold transition-colors duration-200 ${
                  isGenerating || !roadmapInput.targetRole 
                    ? 'bg-purple-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {isGenerating ? "Generating..." : "Generate Roadmap"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDetails;