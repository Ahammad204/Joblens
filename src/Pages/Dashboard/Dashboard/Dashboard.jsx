import useAuth from "../../../Hooks/useAuth";
import { FaHandHoldingMedical, FaHome, FaUsers, FaTasks, FaBoxOpen } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
// import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
//   const [createDropdown, setCreateDropdown] = useState(false);
  const navItemClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#f72b2e]/20 transition-colors duration-200 font-medium";


  return (

    <div className="min-h-screen ">
      {/* Navbar */}
      <div className="bg-[#0fb894] text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          {/* <NavLink to="/"><img className="w-24 h-8 lg:w-44 lg:h-10" src={logo} alt="logo" /></NavLink> */}
         <NavLink to="/" className={({ isActive }) => `${navItemClasses} ${isActive ? "bg-white text-[#0fb894]" : ""}`}>
                 JobLense
              </NavLink>

          {/* Nav Links */}
          <ul className="hidden md:flex items-center gap-2">
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => `${navItemClasses} ${isActive ? "bg-white text-[#0fb894]" : ""}`}>
                <FaHome /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/auto-cv-analysis" className={({ isActive }) => `${navItemClasses} ${isActive ? "bg-white text-[#0fb894]" : ""}`}>
                <FaHome /> Cv Analyis
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/dashboard/myservice" className={({ isActive }) => `${navItemClasses} ${isActive ? "bg-white text-[#0fb894]" : ""}`}>
                <FaTasks /> My Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/myserviceRequest" className={({ isActive }) => `${navItemClasses} ${isActive ? "bg-white text-[#0fb894]" : ""}`}>
                <FaTasks /> My Service Requests
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/myrentalItem" className={({ isActive }) => `${navItemClasses} ${isActive ? "bg-white text-[#0fb894]" : ""}`}>
                <FaBoxOpen /> My Rental Items
              </NavLink>
            </li> */}

            {/* Create Dropdown
            <li className="relative">
              <button
                onClick={() => setCreateDropdown(!createDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#0fb894]/20 transition-colors duration-200"
              >
                <FaHandHoldingMedical /> Create
              </button>
              {createDropdown && (
                <ul className="absolute top-full mt-2 w-52 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
                  <li>
                    <NavLink
                      to="/dashboard/createTask"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setCreateDropdown(false)}
                    >
                      <FaHandHoldingMedical className="inline mr-2" /> Create Service
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/serviceRequest"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setCreateDropdown(false)}
                    >
                      <FaHandHoldingMedical className="inline mr-2" /> Create Service Request
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard/rentPost"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setCreateDropdown(false)}
                    >
                      <FaBoxOpen className="inline mr-2" /> Create Rent Post
                    </NavLink>
                  </li>
                </ul>
              )}
            </li> */}
          </ul>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <p className="hidden md:block">Welcome, {user?.name}</p>
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
