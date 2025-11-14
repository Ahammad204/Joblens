import { useState, useEffect } from "react";
import useAuth from "../../../Hooks/useAuth";
import { analyzeCV } from "../../../utils/skillExtractor";
import Loading from "../../../componet/Shared/Loading/Loading";
import { useRef } from "react";




const CVAutoAnalysis = () => {
  const { user } = useAuth(); 
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasAnalyzed = useRef(false);

useEffect(() => {
  if (!user?.resume) return;

  // stop duplicate calls
  if (hasAnalyzed.current) return;
  hasAnalyzed.current = true;

  const runAnalysis = async () => {
    const analysis = await analyzeCV(user.resume);
    setResult(analysis);
    setLoading(false);
  };

  runAnalysis();
}, [user?.resume]);


  if (loading) return <Loading></Loading>;

  if (result?.error) return <p className="text-red-500">{result.error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg border">
      <h2 className="text-2xl font-semibold mb-4">Resume Skill Extraction</h2>

      <div className="mb-4">
        <p className="font-medium">Skills:</p>
        <div className="flex flex-wrap gap-2">
          {result.skills.map((s, i) => (
            <EditableTag key={i} text={s} />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="font-medium">Tools:</p>
        <div className="flex flex-wrap gap-2">
          {result.tools.map((t, i) => (
            <EditableTag key={i} text={t} />
          ))}
        </div>
      </div>

      <div>
        <p className="font-medium">Roles:</p>
        <div className="flex flex-wrap gap-2">
          {result.roles.map((r, i) => (
            <EditableTag key={i} text={r} />
          ))}
        </div>
      </div>

      <p className="text-sm mt-4 text-gray-500">
        {result.explain}
      </p>
    </div>
  );
};

// Small reusable editable tag component
const EditableTag = ({ text }) => {
  const [value, setValue] = useState(text);
  const [editing, setEditing] = useState(false);

  return (
    <div className="bg-[#f72b2e]/20 px-3 py-1 rounded-full flex items-center gap-2">
      {editing ? (
        <input
          className="bg-transparent outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setEditing(false)}
          autoFocus
        />
      ) : (
        <span onClick={() => setEditing(true)} className="cursor-pointer">
          {value}
        </span>
      )}
    </div>
  );
};

export default CVAutoAnalysis;
