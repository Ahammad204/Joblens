import React, {  useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/navLogo.png";
import useAuth from "../../../Hooks/useAuth";



const Navbar = () => {
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLink = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/allJobs">All Jobs</NavLink>
      </li>
      <li>
        <NavLink to="/allResources">All Resources</NavLink>
      </li>
      
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Left side */}
      <div className="navbar-start">
        {/* Mobile dropdown */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {navLink}
          </ul>
        </div>
        <img className="w-24 h-8 lg:w-44 lg:h-16" src={logo} alt="logo" />
      </div>

      {/* Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLink}</ul>
      </div>

      {/* Right side */}
      <div className="navbar-end relative">
        {user ? (
          <div className="relative">
            <img
              src={user?.avatar || "https://i.ibb.co/7zT7Qp1/user.png"}
              alt="profile"
              className="w-10 h-10 rounded-full cursor-pointer border"
              onClick={() => setOpenMenu(!openMenu)}
            />

            {/* Dropdown */}
            {openMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-base-100 shadow-md rounded-xl p-3 z-20">
                <p className="text-center font-semibold border-b pb-2">
                  {user?.name || "User"}
                </p>
                <ul className="mt-2 space-y-2">
                  <li>
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setOpenMenu(false);
                      }}
                      className="btn btn-sm w-full"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn btn-sm btn-error bg-[#41b39d] outline-none border-none w-full text-white"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-[#0fb894] text-white font-semibold rounded-2xl shadow-md cursor-pointer transition "
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;