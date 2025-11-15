/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import axiosPublic from "../../../utils/axiosPublic";
import { FaUser, FaPhone, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaIndustry, FaDollarSign, FaClipboard } from "react-icons/fa";

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: [],
    yearsOfExperience: "",
    educationLevel: "",
    department: "",
    preferredCareerTrack: "",
    preferredJobType: [],
    preferredIndustry: "",
    expectedSalary: "",
    resume: "",
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [jobTypeInput, setJobTypeInput] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
        skills: user.skills || [],
        yearsOfExperience: user.yearsOfExperience || "",
        educationLevel: user.educationLevel || "",
        department: user.department || "",
        preferredCareerTrack: user.preferredCareerTrack || "",
        preferredJobType: user.preferredJobType || [],
        preferredIndustry: user.preferredIndustry || "",
        expectedSalary: user.expectedSalary || "",
        resume: user.resume || "",
      });
      setSkillsInput(user.skills ? user.skills.join(", ") : "");
      setJobTypeInput(user.preferredJobType ? user.preferredJobType.join(", ") : "");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      preferredJobType: jobTypeInput.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      const res = await axiosPublic.patch(`/users/${user._id}`, updatedData);

      if (res.status === 200 || res.status === 201) {
        toast.success("Profile updated successfully!");
       
      } else {
        toast.error("Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center">My Profile</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200"
      >
        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaUser /> Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaUser /> Email (cannot edit)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaPhone /> Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaMapMarkerAlt /> Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col">
          <label className="font-semibold flex items-center gap-2"><FaBriefcase /> Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="textarea textarea-bordered w-full"
            placeholder="Write a short bio about yourself..."
          />
        </div>

        {/* Skills and Experience */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaBriefcase /> Skills (comma separated)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="input input-bordered w-full"
              placeholder="React, Node.js, CSS..."
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaBriefcase /> Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="0"
            />
          </div>
        </div>

        {/* Education & Career */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaGraduationCap /> Education Level</label>
            <input
              type="text"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaGraduationCap /> Department / Major</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaBriefcase /> Preferred Career Track</label>
            <input
              type="text"
              name="preferredCareerTrack"
              value={formData.preferredCareerTrack}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaBriefcase /> Preferred Job Type</label>
            <input
              type="text"
              value={jobTypeInput}
              onChange={(e) => setJobTypeInput(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Full-time, Remote..."
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaIndustry /> Preferred Industry</label>
            <input
              type="text"
              name="preferredIndustry"
              value={formData.preferredIndustry}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold flex items-center gap-2"><FaDollarSign /> Expected Salary (BDT)</label>
            <input
              type="number"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Resume */}
        <div className="flex flex-col">
          <label className="font-semibold flex items-center gap-2"><FaClipboard /> Resume (Paste Text )</label>
          <textarea
            name="resume"
            value={formData.resume}
            onChange={handleChange}
            rows={4}
            className="textarea textarea-bordered w-full"
            placeholder="Paste your resume text or URL here..."
          />
        </div>

        <button
          type="submit"
          className="bg-[#0fb894] text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-500 transition-colors duration-200 w-full text-lg"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
