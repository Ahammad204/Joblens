/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axiosPublic from "../../../utils/axiosPublic";
import toast from "react-hot-toast";
import Loading from "../../../componet/Shared/Loading/Loading";

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    platform: "",
    url: "",
    relatedSkills: "",
    cost: "",
  });

  // Fetch all resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await axiosPublic.get("/api/learning", { withCredentials: true });
      setResources(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch resources");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Delete resource
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await axiosPublic.delete(`/api/learning/${id}`, { withCredentials: true });
      setResources(resources.filter((r) => r._id !== id));
      toast.success("Resource deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resource");
    }
  };

  // Handle input changes in modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource((prev) => ({ ...prev, [name]: value }));
  };

  // Create new resource
  const handleCreateResource = async (e) => {
    e.preventDefault();
    try {
      const resourceToSend = {
        ...newResource,
        relatedSkills: newResource.relatedSkills.split(",").map((s) => s.trim()),
      };
      const res = await axiosPublic.post("/api/learning", resourceToSend, { withCredentials: true });
      setResources((prev) => [...prev, resourceToSend]);
      setShowModal(false);
      setNewResource({ title: "", platform: "", url: "", relatedSkills: "", cost: "" });
      toast.success("Resource created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create resource");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Resources</h2>
      <button
        className="bg-[#41b39d] text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        onClick={() => setShowModal(true)}
      >
        Create Resource
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-bold mb-4">Create New Resource</h3>
            <form onSubmit={handleCreateResource} className="space-y-2">
              <input
                name="title"
                placeholder="Title"
                value={newResource.title}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="platform"
                placeholder="Platform (YouTube, Udemy, etc.)"
                value={newResource.platform}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="url"
                placeholder="URL"
                value={newResource.url}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
                required
              />
              <input
                name="relatedSkills"
                placeholder="Related Skills (comma separated)"
                value={newResource.relatedSkills}
                onChange={handleInputChange}
                className="w-full border px-2 py-1 rounded"
              />
              <input
                name="cost"
                placeholder="Cost (Free / Paid)"
                value={newResource.cost}
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
            <th className="border px-4 py-2">Platform</th>
            <th className="border px-4 py-2">URL</th>
            <th className="border px-4 py-2">Skills</th>
            <th className="border px-4 py-2">Cost</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((res) => (
            <tr key={res._id}>
              <td className="border px-4 py-2">{res.title}</td>
              <td className="border px-4 py-2">{res.platform}</td>
              <td className="border px-4 py-2">
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Link
                </a>
              </td>
              <td className="border px-4 py-2">{res.relatedSkills.join(", ")}</td>
              <td className="border px-4 py-2">{res.cost}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(res._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {resources.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No resources found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageResources;
