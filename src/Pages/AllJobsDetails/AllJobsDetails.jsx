import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Briefcase, MapPin, Clock, DollarSign, Building } from "lucide-react";
import axiosPublic from "../../utils/axiosPublic";


const AllJobsDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
//   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosPublic.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading job details...
        </p>
      </div>
    );

  if (!job)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Job not found.</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
            <p className="text-gray-600 flex items-center gap-2 mt-2">
              <Building className="w-4 h-4 text-[#0fb894]" />
              {job.company || "Unknown Company"}
            </p>
          </div>

          <button className="bg-[#0fb894] hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200">
            Apply Now
          </button>
        </div>

        {/* Job meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0fb894]" />
            <span>{job.location || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0fb894]" />
            <span>{job.type || "Full-time"}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#0fb894]" />
            <span>{job.salary ? `${job.salary} BDT` : "Negotiable"}</span>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white mt-8 rounded-2xl shadow-md p-8 border border-gray-200 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Job Description
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {job.description || "No description provided."}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Requirements
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            {job.requirements && job.requirements.length > 0 ? (
              job.requirements.map((req, i) => <li key={i}>{req}</li>)
            ) : (
              <li>No specific requirements listed.</li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Preferred Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills && job.skills.length > 0 ? (
              job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-600">No preferred skills provided.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AllJobsDetails;
