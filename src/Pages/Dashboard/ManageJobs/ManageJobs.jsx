/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axiosPublic from "../../../utils/axiosPublic";
import toast from "react-hot-toast";
import Loading from "../../../componet/Shared/Loading/Loading";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    skills: "",
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosPublic.get("/api/jobs", { withCredentials: true });
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch jobs");
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosPublic.delete(`/api/jobs/${id}`, { withCredentials: true });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const jobToSend = {
        ...newJob,
        skills: newJob.skills.split(",").map((s) => s.trim()),
      };
      const res = await axiosPublic.post("/api/jobs", jobToSend, { withCredentials: true });
      setJobs((prev) => [...prev, jobToSend]);
      setShowModal(false);
      setNewJob({ title: "", company: "", location: "", jobType: "", experienceLevel: "", skills: "" });
      toast.success("Job created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create job");
    }
  };

  if (loading) return <Loading></Loading>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        onClick={() => setShowModal(true)}
      >
        Create Job
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-4">Create New Job</h3>
            <form onSubmit={handleCreateJob} className="space-y-2">
              <input
                name="title"
                placeholder="Job Title"
                value={newJob.title}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="company"
                placeholder="Company"
                value={newJob.company}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="location"
                placeholder="Location"
                value={newJob.location}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="jobType"
                placeholder="Job Type (Full-time, Internship, etc.)"
                value={newJob.jobType}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="experienceLevel"
                placeholder="Experience Level (Beginner, Mid-level, etc.)"
                value={newJob.experienceLevel}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="skills"
                placeholder="Skills (comma separated)"
                value={newJob.skills}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Company</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Experience</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td className="border px-4 py-2">{job.title}</td>
              <td className="border px-4 py-2">{job.company}</td>
              <td className="border px-4 py-2">{job.location}</td>
              <td className="border px-4 py-2">{job.jobType}</td>
              <td className="border px-4 py-2">{job.experienceLevel}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(job._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No jobs found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageJobs;
