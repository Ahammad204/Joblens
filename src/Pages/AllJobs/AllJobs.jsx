/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState, useRef } from "react";

import { FaSearch, FaMapMarkerAlt, FaSuitcase, FaClock, FaTags } from "react-icons/fa";
import { Link } from "react-router-dom";
import axiosPublic from "../../utils/axiosPublic";

/**
 * AllJobs page
 * - GET /api/jobs expected to return an array of job objects with fields:
 *   { _id, title, company, location, skills: [], experienceLevel, jobType }
 */

const PAGE_SIZE = 9;

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [skillsInput, setSkillsInput] = useState(""); // comma separated
  const [page, setPage] = useState(1);

  // debounce refs
  const searchRef = useRef();
  const skillsRef = useRef();

  useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axiosPublic.get("/api/jobs");
        if (!mounted) return;
        setJobs(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchJobs();
    return () => {
      mounted = false;
    };
  }, []);

  // derive unique filter values for dropdowns
  const locations = useMemo(() => {
    const setLoc = new Set(jobs.map((j) => j.location || "Remote"));
    return Array.from(setLoc).sort();
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const setT = new Set(jobs.map((j) => j.jobType || "Full-time"));
    return Array.from(setT);
  }, [jobs]);

  const experienceLevels = useMemo(() => {
    const setE = new Set(jobs.map((j) => j.experienceLevel || "Entry-level"));
    return Array.from(setE);
  }, [jobs]);

  // filtering logic
  const filteredJobs = useMemo(() => {
    let result = jobs.slice();

    const searchLower = search.trim().toLowerCase();
    if (searchLower) {
      result = result.filter(
        (j) =>
          (j.title || "").toLowerCase().includes(searchLower) ||
          (j.company || "").toLowerCase().includes(searchLower)
      );
    }

    if (locationFilter) {
      result = result.filter((j) => (j.location || "Remote") === locationFilter);
    }

    if (jobTypeFilter) {
      result = result.filter((j) => (j.jobType || "").toLowerCase() === jobTypeFilter.toLowerCase());
    }

    if (experienceFilter) {
      result = result.filter((j) => (j.experienceLevel || "").toLowerCase() === experienceFilter.toLowerCase());
    }

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (skills.length) {
      // job must contain all entered skills (subset)
      result = result.filter((j) => {
        const jobSkills = (j.skills || []).map((s) => s.toLowerCase());
        return skills.every((sk) => jobSkills.includes(sk));
      });
    }

    return result;
  }, [jobs, search, locationFilter, jobTypeFilter, experienceFilter, skillsInput]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const pageJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // debounce handlers
  useEffect(() => {
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(searchRef.current);
  }, [search, locationFilter, jobTypeFilter, experienceFilter, skillsInput]);

  // UI helpers
  const clearFilters = () => {
    setSearch("");
    setLocationFilter("");
    setJobTypeFilter("");
    setExperienceFilter("");
    setSkillsInput("");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Jobs</h1>
        <p className="text-gray-600 mt-1">Find student & entry-level opportunities tailored for you.</p>
      </header>

      {/* Search & Filters */}
      <section className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          {/* Search */}
          <div className="flex items-center flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title or company..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="select select-sm select-bordered"
            >
              <option value="">All locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type */}
          <div className="flex items-center gap-2">
            <FaSuitcase className="text-gray-500" />
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="select select-sm select-bordered"
            >
              <option value="">All job types</option>
              {jobTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-2">
            <FaClock className="text-gray-500" />
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="select select-sm select-bordered"
            >
              <option value="">All experience</option>
              {experienceLevels.map((eL) => (
                <option key={eL} value={eL}>
                  {eL}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills input + actions */}
        <div className="mt-3 flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            <FaTags className="text-gray-400" />
            <input
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Skills (comma separated) — e.g. React, Node.js"
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm hover:shadow"
            >
              Clear
            </button>
            <div className="px-4 py-2 rounded-lg bg-[#0fb894] text-white flex items-center gap-2">
              <span className="font-semibold">{filteredJobs.length}</span>
              <span className="text-sm">Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Job list */}
      <section>
        {loading ? (
          // simple skeleton
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow animate-pulse h-40" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-10 text-gray-600">No jobs found — try different filters.</div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              {pageJobs.map((job) => (
                <article key={job._id} className="bg-white rounded-xl shadow hover:shadow-xl transition-shadow p-5 border border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt /> {job.location || "Remote"}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{job.jobType}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">{job.experienceLevel}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-sm px-3 py-2 rounded-md border border-[#0fb894] text-[#0fb894] hover:bg-[#0fb894] hover:text-white transition"
                      >
                        View
                      </Link>
                      <button className="text-sm px-3 py-2 rounded-md bg-[#0fb894] text-white hover:bg-green-600 transition">
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* skills */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(job.skills || []).slice(0, 8).map((s, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span> -{" "}
                <span className="font-medium">{Math.min(page * PAGE_SIZE, filteredJobs.length)}</span> of{" "}
                <span className="font-medium">{filteredJobs.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded border bg-white disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="px-3 py-2 rounded border bg-white">
                  Page {page} / {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded border bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AllJobs;
