/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import axiosPublic from "../../utils/axiosPublic";



const AllResources = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [costFilter, setCostFilter] = useState("");

  // Fetch resources from backend
  const fetchResources = async () => {
    try {
      const res = await axiosPublic.get("/api/learning"); // Using axiosPublic
      setResources(res.data);
      setFilteredResources(res.data);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Handle search & filter
  useEffect(() => {
    let temp = [...resources];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.relatedSkills.some((skill) =>
            skill.toLowerCase().includes(term)
          )
      );
    }

    if (platformFilter) {
      temp = temp.filter(
        (r) => r.platform.toLowerCase() === platformFilter.toLowerCase()
      );
    }

    if (costFilter) {
      temp = temp.filter(
        (r) => r.cost.toLowerCase() === costFilter.toLowerCase()
      );
    }

    setFilteredResources(temp);
  }, [searchTerm, platformFilter, costFilter, resources]);

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Learning Resources
        </h1>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex items-center bg-white p-2 rounded shadow w-full sm:w-1/2">
            {/* <searchTerm className="mr-2 text-gray-400" size={18} /> */}
            <input
              type="text"
              placeholder="Search by title or skill..."
              className="w-full outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="p-2 rounded shadow w-full sm:w-1/4 bg-white"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="">All Platforms</option>
            <option value="YouTube">YouTube</option>
            <option value="Coursera">Coursera</option>
            <option value="Udemy">Udemy</option>
            <option value="freeCodeCamp">freeCodeCamp</option>
            <option value="Google">Google</option>
          </select>

          <select
            className="p-2 rounded shadow w-full sm:w-1/4 bg-white"
            value={costFilter}
            onChange={(e) => setCostFilter(e.target.value)}
          >
            <option value="">All Costs</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No resources found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <a
                key={res._id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2">{res.title}</h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Platform:</span> {res.platform}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold">Skills:</span> {res.relatedSkills.join(", ")}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Cost:</span> {res.cost}
                  </p>
                </div>
                <button className="mt-3 bg-[#41b39d] text-white py-2 px-4 rounded  transition">
                  Go to Resource
                </button>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllResources;
