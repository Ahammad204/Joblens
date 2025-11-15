import React from "react";
import { FaBriefcase, FaChalkboardTeacher, FaMapMarkerAlt } from "react-icons/fa";

const opportunities = [
  {
    id: 1,
    title: "Web Development Training",
    type: "Training Program",
    provider: "Bangladesh IT Institute",
    location: "Dhaka, Bangladesh",
    forDisadvantaged: true,
    description: "Free 3-month web development course for women and underprivileged youth.",
    link: "#",
  },
  {
    id: 2,
    title: "Junior Software Engineer",
    type: "Job",
    provider: "Tech Innovators Ltd.",
    location: "Chittagong, Bangladesh",
    forDisadvantaged: false,
    description: "Entry-level position for software developers. Prefer candidates with internship experience.",
    link: "#",
  },
  {
    id: 3,
    title: "Vocational Skills Program",
    type: "Training Program",
    provider: "Government Skill Development Center",
    location: "Khulna, Bangladesh",
    forDisadvantaged: true,
    description: "Skill development program targeting rural women and youth.",
    link: "#",
  },
];

const Hilight = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
        Opportunities for Jobs & Training
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className={`relative border rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105 ${
              opportunity.forDisadvantaged
                ? "bg-gradient-to-r from-green-50 to-green-100 border-green-400"
                : "bg-white border-gray-200"
            }`}
          >
            {opportunity.forDisadvantaged && (
              <span className="absolute top-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
                🌟 For Disadvantaged
              </span>
            )}

            <h2 className="text-2xl font-bold mb-3 text-gray-900">{opportunity.title}</h2>

            <div className="flex items-center text-gray-600 mb-2">
              {opportunity.type === "Job" ? <FaBriefcase className="mr-2" /> : <FaChalkboardTeacher className="mr-2" />}
              <span>{opportunity.type}</span>
            </div>

            <p className="text-gray-700 mb-1">
              <strong>Provider:</strong> {opportunity.provider}
            </p>

            <div className="flex items-center text-gray-700 mb-3">
              <FaMapMarkerAlt className="mr-2" />
              <span>{opportunity.location}</span>
            </div>

            <p className="text-gray-700 mb-4">{opportunity.description}</p>

            <a
              href={opportunity.link}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Learn More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hilight;
