import { useState, useEffect } from "react";
import useAuth from "../../../Hooks/useAuth";
import Loading from "../../../componet/Shared/Loading/Loading";
import axiosPublic from "../../../utils/axiosPublic";
import { analyzeCV } from "../../../utils/skillExtractor";

const CVAutoAnalysis = () => {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const res = await axiosPublic.get("/api/me", { withCredentials: true });
      const userData = res.data.user;

      if (userData.skills && userData.tools && userData.roles && userData.cvAnalysis) {
        // Already analyzed
        setResult({
          skills: userData.skills,
          tools: userData.tools,
          roles: userData.roles,
          explain: userData.cvAnalysis.explain,
        });
      } else {
        // No analysis yet
        setResult(null);
      }
    } catch (err) {
      console.error("Fetch User Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!user?.resume) return;

    try {
      setReanalyzing(true);
      const analysis = await analyzeCV(user.resume);

      // Save to database
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

      setResult(analysis);
    } catch (err) {
      console.error("CV Analysis Save Error:", err);
    } finally {
      setReanalyzing(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [user?.resume]);

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-white to-gray-50 shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">
        Resume Skill Extraction
      </h2>

      {!result ? (
        <>
          <p className="text-gray-500 mb-4 text-center">
            No analysis yet.
          </p>
          <button
            onClick={runAnalysis}
            disabled={reanalyzing}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
          >
            {reanalyzing ? "Analyzing..." : "Analyze CV"}
          </button>
        </>
      ) : (
        <>
          <Section title="Skills" items={result.skills} />
          <Section title="Tools" items={result.tools} />
          <Section title="Roles" items={result.roles} />

          <p className="text-gray-500 mt-6 text-sm leading-relaxed">
            {result.explain}
          </p>

          <button
            onClick={runAnalysis}
            disabled={reanalyzing}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
          >
            {reanalyzing ? "Re-analyzing..." : "Re-analyze CV"}
          </button>
        </>
      )}
    </div>
  );
};

// Reusable section for Skills, Tools, Roles
const Section = ({ title, items }) => (
  <div className="mb-6">
    <p className="font-semibold text-gray-700 mb-2">{title}:</p>
    <div className="flex flex-wrap gap-3">
      {items.map((item, i) => (
        <EditableTag key={i} text={item} />
      ))}
    </div>
  </div>
);

// Editable tag with modern styling
const EditableTag = ({ text }) => {
  const [value, setValue] = useState(text);
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-red-100 hover:bg-red-200 transition-colors px-4 py-1 rounded-full flex items-center gap-2 cursor-pointer shadow-sm">
      {editing ? (
        <input
          className="bg-transparent outline-none text-red-700 font-medium"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setEditing(false)}
          autoFocus
        />
      ) : (
        <span onClick={() => setEditing(true)} className="text-red-700 font-medium">
          {value}
        </span>
      )}
    </div>
  );
};

export default CVAutoAnalysis;
