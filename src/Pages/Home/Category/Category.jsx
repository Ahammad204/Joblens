import React, { useEffect, useState } from "react";
import axiosPublic from "../../../utils/axiosPublic";
import { Briefcase, Building2, MapPin } from "lucide-react";

const Category = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosPublic.get("/api/jobs");
        setJobs(res.data?.slice(0, 4));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const getIcon = (category) => {
    if (!category)
      return <Briefcase size={38} className="text-[#41b39d]" />;

    const cat = category.toLowerCase();

    if (cat.includes("it") || cat.includes("developer"))
      return <Briefcase size={38} className="text-[#41b39d]" />;

    if (cat.includes("delivery"))
      return <Building2 size={38} className="text-[#41b39d]" />;

    if (cat.includes("support"))
      return <Building2 size={38} className="text-[#41b39d]" />;

    return <Briefcase size={38} className="text-[#41b39d]" />;
  };

  return (
    <div className="my-10 mx-auto px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-[#41b39d] via-[#2ea188] to-[#41b39d] bg-clip-text text-transparent">
          Hot Opportunities 🔥
        </h2>

        {/* Job Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="rounded-2xl p-6 bg-white/70 backdrop-blur-lg shadow-md border border-white/40
                         hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-2">

                {/* Icon */}
                <div className="p-3 bg-[#41b39d]/10 rounded-full">
                  {getIcon(job.category)}
                </div>

                {/* Job Title */}
                <h3 className="font-semibold text-lg text-gray-800">
                  {job.title}
                </h3>

                {/* Company */}
                <p className="text-sm text-gray-600">
                  {job.company}
                </p>

                {/* Location */}
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <MapPin size={14} className="mr-1 text-[#41b39d]" />
                  {job.location || "Not specified"}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Category;
