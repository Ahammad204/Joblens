/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../componet/Shared/Loading/Loading";
import axiosPublic from "../../../utils/axiosPublic";
import { analyzeCV } from "../../../utils/skillExtractor";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CVDocument from "../../../componet/CVDocument/CVDocument";

// --- Utility Components for Editing ---

// Editable Input Field for single-value properties
const EditableInput = ({ label, initialValue, onSave }) => {
  const [value, setValue] = useState(initialValue || "");
  const [isEditing, setIsEditing] = useState(false);


  const handleSave = () => {
    if (value.trim() !== (initialValue || "")) {
      onSave(value.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex gap-2">
        {!isEditing ? (
          <p
            onClick={() => setIsEditing(true)}
            className="text-lg font-semibold text-gray-900 flex-grow cursor-pointer p-2 border border-transparent hover:border-gray-300 rounded-md transition-all"
          >
            {value || `Add your ${label.toLowerCase()}`}
          </p>
        ) : (
          <>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="flex-grow p-2 border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-lg"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Save
            </button>
          </>
        )}
      </div>
      
    </div>
  );
};

// Editable Tag component (Simplified for profile editing)
const EditableTag = ({ text, onRemove }) => {
  return (
    <div className="bg-red-100 hover:bg-red-200 transition-colors px-4 py-1 rounded-full flex items-center gap-2 shadow-sm text-red-700 font-medium text-sm">
      <span>{text}</span>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 focus:outline-none"
        aria-label="Remove skill"
      >
        &times;
      </button>
    </div>
  );
};

// Section for Skills/Tools (Handles array-based data)
const EditableTagSection = ({ title, items, onUpdate }) => {
  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    const itemToAdd = newItem.trim();
    if (itemToAdd && !items.includes(itemToAdd)) {
      onUpdate([...items, itemToAdd]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    onUpdate(items.filter((item) => item !== itemToRemove));
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-xl border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">{title}</h3>
      <div className="flex flex-wrap gap-3 mb-4">
        {items.map((item, i) => (
          <EditableTag key={i} text={item} onRemove={() => handleRemoveItem(item)} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`Add new ${title.toLowerCase().slice(0, -1)}`}
          onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          className="flex-grow p-2 border border-gray-300 rounded-lg text-sm"
        />
        <button
          onClick={handleAddItem}
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Add
        </button>
      </div>
    </div>
  );
};


// --- Main Component ---

const CVAutoAnalysis = () => {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);
const [generatedCV, setGeneratedCV] = useState(null);
const [loadingCV, setLoadingCV] = useState(false);

const generateCV = async () => {
  try {
    setLoadingCV(true);
    const res = await axiosPublic.post("/api/cv/generate", {}, { withCredentials: true });
    setGeneratedCV(res.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingCV(false);
  }
};
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await axiosPublic.get("/api/me", { withCredentials: true });
      // Use the fetched user data to populate the editable state
      setProfileData(res.data.user);
    } catch (err) {
      console.error("Fetch User Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  // Handlers to update the state and save to server
  const handleProfileUpdate = async (field, value) => {
    if (!profileData || !user?._id) return;
    
    // Optimistic UI update
    const updatedData = { ...profileData, [field]: value };
    setProfileData(updatedData);

    try {
      const res = await axiosPublic.patch(`/users/${user._id}`, { [field]: value }, { withCredentials: true });
      // Update the global user context (if necessary, depends on useAuth implementation)
      // setUser(res.data); // Assuming server returns the updated user object
      console.log(`${field} updated successfully.`);
    } catch (err) {
      console.error(`Update ${field} Error:`, err);
      // Revert if API fails (optional, but good practice)
      // setProfileData(profileData); 
    }
  };

  const handleArrayUpdate = async (field, newArray) => {
      handleProfileUpdate(field, newArray);
  };

  const runAnalysis = async () => {
    if (!user?.resume) return;

    try {
      setReanalyzing(true);
      const analysis = await analyzeCV(user.resume);

      // Save analysis results to database AND update the current state
      await axiosPublic.post(
        "/api/cv/save",
        {
          skills: analysis.skills,
          tools: analysis.tools,
          roles: analysis.roles,
          explain: analysis.explain,
        },
        { withCredentials: true }
      );
      
      // Update profileData state with new analysis results
      setProfileData(prev => ({
        ...prev,
        skills: analysis.skills,
        tools: analysis.tools,
        roles: analysis.roles,
        cvAnalysis: { explain: analysis.explain, updatedAt: new Date() }
      }));
    } catch (err) {
      console.error("CV Analysis Save Error:", err);
    } finally {
      setReanalyzing(false);
    }
  };

  if (loading || !profileData) return <Loading />;

  const { name, email, education, experience, careerTrack, skills, tools, cvAnalysis, roles } = profileData;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl border border-gray-100">
      <h2 className="text-4xl font-extrabold mb-8 text-[#41b39d] border-b pb-4">
        <span role="img" aria-label="profile"></span> Your Profile
      </h2>
      

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Personal Details</h3>
          <EditableInput
            label="Full Name"
            initialValue={name}
            onSave={(value) => handleProfileUpdate("name", value)}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email (Cannot Edit)</label>
            <p className="text-lg font-semibold text-gray-500 p-2">{email}</p>
          </div>
          <EditableInput
            label="Education"
            initialValue={education}
            onSave={(value) => handleProfileUpdate("education", value)}
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Career Info</h3>
          <EditableInput
            label="Experience Level"
            initialValue={experience}
            onSave={(value) => handleProfileUpdate("experience", value)}
          />
          <EditableInput
            label="Career Track"
            initialValue={careerTrack}
            onSave={(value) => handleProfileUpdate("careerTrack", value)}
          />
          <EditableInput
            label="Roles (Derived from CV)"
            initialValue={roles?.join(", ") || "N/A"}
            onSave={(value) => handleProfileUpdate("roles", value.split(",").map(s => s.trim()).filter(Boolean))}
          />
        </div>
      </div>
      
      <hr className="my-8 border-gray-200" />
      
      {/* Skills and Tools */}
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Skills & Tools (Editable)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
        <EditableTagSection
          title="Skills"
          items={skills || []}
          onUpdate={(newSkills) => handleArrayUpdate("skills", newSkills)}
        />
        <EditableTagSection
          title="Tools"
          items={tools || []}
          onUpdate={(newTools) => handleArrayUpdate("tools", newTools)}
        />
      </div>

      <hr className="my-8 border-gray-200" />

      {/* CV Analysis Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          <span role="img" aria-label="analysis">📄</span> CV Auto-Analysis Summary
        </h3>
        
        <p className="text-gray-600 mb-4 text-sm">
          This data was **automatically extracted from your resume** and is used for job matching and recommendations. You can manually edit the skills/tools above, or re-run the analysis below.
        </p>

        {cvAnalysis?.explain ? (
          <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-inner">
            <h4 className="font-semibold text-[#41b39d] mb-2">AI Explanation:</h4>
            <p className="text-gray-700 leading-relaxed text-sm">
              {cvAnalysis.explain}
            </p>
            <p className="mt-3 text-xs text-gray-500">
              Last updated: {new Date(cvAnalysis.updatedAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No CV analysis data found.</p>
        )}

        <button
          onClick={runAnalysis}
          disabled={reanalyzing || !user?.resume}
          className={`mt-6 w-full ${reanalyzing ? 'bg-gray-400' : 'bg-[#41b39d] '} text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg`}
        >
          {reanalyzing ? "Re-analyzing CV..." : user?.resume ? "Re-analyze CV" : "Upload Resume to Analyze"}
        </button>
      </div>
     

{/* --- AI Generated CV Section --- */}
<div className="mt-8">
  <button
    onClick={generateCV}
    disabled={loadingCV}
    className={`w-full ${loadingCV ? 'bg-gray-400' : 'bg-[#41b39d] '} text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg`}
  >
    {loadingCV ? "Generating CV..." : "Generate AI CV"}
  </button>
</div>
{generatedCV && (
  <div className="bg-white p-6 rounded-xl shadow-md mt-6">
    <h2 className="text-3xl font-bold mb-4">{generatedCV?.personalInfo?.name}</h2>
    <p className="text-sm mb-2">{generatedCV?.personalInfo?.email}</p>
    <p className="mb-4">{generatedCV?.professionalSummary}</p>

    <h3 className="font-semibold mt-4">Experience</h3>
    {generatedCV?.experience?.map((exp, i) => (
      <div key={i} className="mb-2">
        <p className="font-semibold">{exp.role} @ {exp.company}</p>
        <ul className="list-disc ml-5 text-sm">
          {exp.description.map((d, j) => <li key={j}>{d}</li>)}
        </ul>
      </div>
    ))}

    <h3 className="font-semibold mt-4">Projects</h3>
    {generatedCV?.projects?.map((proj, i) => (
      <div key={i} className="mb-2">
        <p className="font-semibold">{proj.title}</p>
        <ul className="list-disc ml-5 text-sm">
          {proj.description.map((d, j) => <li key={j}>{d}</li>)}
        </ul>
      </div>
    ))}

    <h3 className="font-semibold mt-4">Skills & Tools</h3>
    <p>{generatedCV?.skills?.join(", ")} | {generatedCV?.tools?.join(", ")}</p>

    <h3 className="font-semibold mt-4">Recommendations</h3>
    <ul className="list-disc ml-5 text-sm">
      {generatedCV?.recommendations?.map((r, i) => <li key={i}>{r}</li>)}
    </ul>



<PDFDownloadLink
  document={<CVDocument cv={generatedCV} />}
  fileName={`${generatedCV.personalInfo.name}_CV.pdf`}
  className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg"
>
  {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
</PDFDownloadLink>

  </div>
)}

      
    </div>
  );
};

export default CVAutoAnalysis;