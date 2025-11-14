import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import axiosPublic from '../../../utils/axiosPublic';
import toast from 'react-hot-toast';
// REMOVED: import html2pdf from 'html22pdf.js';
import Loading from '../../../componet/Shared/Loading/Loading';

// --- Icons (Assuming you have access to icons like lucide-react or similar)
// If not, you can replace these with simple text or other available icons.
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const TimeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const SkillIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;


const Roadmap = () => {
    const [roadmapData, setRoadmapData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();
    // Ref for the content (still useful for targeting in case of future changes, but not strictly needed for window.print)
    const roadmapRef = useRef(null); 

    // 1. Fetch the Roadmap (No change needed here)
    useEffect(() => {
        const fetchRoadmap = async () => {
            if (!user) {
                navigate('/login');
                return;
            }
            setIsLoading(true);
            try {
                const res = await axiosPublic.get("/api/roadmap");
                setRoadmapData(res.data);
            } catch (err) {
                console.error("Error fetching roadmap:", err);
                toast.error("No active roadmap found. Please generate one from the dashboard.");
                navigate('/dashboard'); // Go back to dashboard if no roadmap is found
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoadmap();
    }, [user, navigate]);

    // 2. PDF Download Handler - MODIFIED
    const handleDownloadPDF = () => {
        if (!roadmapData) return;
        
        // Use the browser's native print function (Ctrl+P or Cmd+P)
        // The user will be prompted to select "Save as PDF" (or similar) 
        // as the printer destination.
        window.print();
        
        // Optional: A simple toast notification after the print dialog is opened
        toast.success(`Opening print dialog for "${roadmapData.targetRole}_Roadmap.pdf". Please select 'Save as PDF' as the destination.`, {
            duration: 6000 // Longer duration to allow user to read the instruction
        });
    };
    
    // --- Rest of the component (No change needed for display) ---

    if (isLoading) {
        return <Loading></Loading>;
    }

    if (!roadmapData) {
        return (
            <div className="text-center p-10 bg-white shadow-lg rounded-xl max-w-2xl mx-auto mt-10">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Roadmap Not Found</h2>
                <p className="text-gray-600 mb-6">It looks like you haven't generated a roadmap yet.</p>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                    Go to Dashboard to Generate
                </button>
            </div>
        );
    }

    const { title, targetRole, timeframe, learningTime, currentSkills, applicationTime, phases } = roadmapData;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center pb-4 border-b border-gray-200 print:hidden"> {/* Hide button when printing */}
                <h1 className="text-4xl font-extrabold text-gray-900">{title}</h1>
                <button
                    onClick={handleDownloadPDF}
                    className="flex items-center space-x-2 bg-[#0fb894] text-white px-5 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg"
                >
                    <SkillIcon /> 
                    <span>Download as PDF</span>
                </button>
            </header>

            {/* Content Container for PDF Generation */}
            <div ref={roadmapRef} className="bg-white p-8 rounded-2xl shadow-xl roadmap-pdf-container">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-purple-700 mb-2 sm:mb-0">
                        {targetRole}
                    </h2>
                    <p className="text-lg font-medium text-gray-600">
                        Start Job Applications: <span className="font-bold text-red-500">{applicationTime || 'Month TBD'}</span>
                    </p>
                </div>

                {/* Summary Section */}
                <div className="grid md:grid-cols-3 gap-6 mb-10 text-center">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <TargetIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="font-bold text-gray-700">Target Role</p>
                        <p className="text-sm text-gray-500">{targetRole}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <TimeIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="font-bold text-gray-700">Duration</p>
                        <p className="text-sm text-gray-500">{timeframe}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <TimeIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="font-bold text-gray-700">Learning Commitment</p>
                        <p className="text-sm text-gray-500">{learningTime}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Your Current Skills</h3>
                    <p className="text-sm text-gray-500 italic">
                        {currentSkills?.length > 0 ? currentSkills.join(', ') : 'No skills provided in profile.'}
                    </p>
                </div>

                {/* Timeline / Phases Section */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Roadmap Timeline</h3>
                
                <div className="space-y-12">
                    {phases.map((phase, phaseIndex) => (
                        <div key={phaseIndex} className="relative pl-8 sm:pl-16">
                            {/* Vertical line connector */}
                            {phaseIndex < phases.length - 1 && (
                                <div className="absolute left-4 sm:left-7 top-0 bottom-0 w-0.5 bg-purple-200"></div>
                            )}

                            {/* Phase Circle Icon */}
                            <div className="absolute left-1 sm:left-4 top-0 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white z-10 shadow-lg border-4 border-white">
                                <span className="font-bold text-sm">{phaseIndex + 1}</span>
                            </div>

                            {/* Phase Content */}
                            <div className="bg-purple-50 p-6 rounded-xl shadow-md border-l-4 border-purple-600">
                                <h4 className="text-xl font-bold text-purple-800 mb-2">{phase.phaseName}</h4>
                                <p className="text-gray-700 italic mb-4">Goal: {phase.goal}</p>

                                {/* Steps within the phase */}
                                <div className="space-y-4 pt-4 border-t border-purple-200">
                                    {phase.steps.map((step, stepIndex) => (
                                        <div key={stepIndex} className="p-4 bg-white rounded-lg border border-purple-100 shadow-sm">
                                            <h5 className="font-bold text-gray-900 flex items-center">
                                                <span className="text-purple-600 mr-2">✓</span> {step.topic}
                                            </h5>
                                            <p className="text-sm text-gray-600 pl-4">{step.details}</p>
                                            {step.projectIdea && (
                                                <div className="mt-2 pt-2 border-t border-gray-100 text-sm">
                                                    <p className="font-medium text-gray-700">
                                                        Project Idea: <span className="italic text-purple-500">{step.projectIdea}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="text-center mt-8 print:hidden"> {/* Hide link when printing */}
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Roadmap;