import useAuth from "../../../Hooks/useAuth";
import { FaHandHoldingMedical, FaHome, FaUsers, FaTasks, FaBoxOpen } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import useAdmin from "../../../Hooks/useAdmin";
import Loading from "../../../componet/Shared/Loading/Loading";
// import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
//   const [createDropdown, setCreateDropdown] = useState(false);
  const navItemClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#f72b2e]/20 transition-colors duration-200 font-medium";
const [isAdmin, isAdminLoading] = useAdmin();
  if(isAdminLoading ){
    return <Loading></Loading>
  }

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
                    {isAdmin ? (
            <>
         <li>
              <NavLink to="/dashboard/manageJobs" className={({ isActive }) => `${navItemClasses} ${isActive ? "bg-white text-[#0fb894]" : ""}`}>
                <FaHome /> Manage Jobs
              </NavLink>
            </li>
            
            
            </>
          ) : (
            <></>
          )}
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => `${navItemClasses} ${isActive ? "bg-white text-[#0fb894]" : ""}`}>
                <FaHome /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/profile" className={({ isActive }) => `${navItemClasses} ${isActive ? "bg-white text-[#0fb894]" : ""}`}>
                <FaHome /> Profile
              </NavLink>
            </li>
        
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
