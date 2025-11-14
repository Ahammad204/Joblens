import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../assets/hero.json";
import { NavLink } from "react-router-dom";

const Banner = () => {
  return (
    <div className="relative w-full ">
      {/* Container */}
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-10 gap-10 max-w-7xl">
        {/* Left Side Text */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Welcome to <span className="text-[#3fb199]">JobLens</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Discover your next career opportunity. Explore <span className="font-semibold">jobs</span>, 
            get <span className="font-semibold">personalized recommendations</span>, 
            and grow your <span className="font-semibold">skills</span> — all in one platform.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <NavLink
              to="/register"
              className="px-6 py-3 bg-[#4cc0a7] text-gray-900  font-semibold rounded-2xl shadow-md hover:bg-[#742c17] hover:text-white transition"
            >
              Get Started
            </NavLink>
            <NavLink
              to="/about"
              className="px-6 py-3 border border-white font-semibold rounded-2xl hover:bg-white hover:text-gray-900 transition"
            >
              Learn More
            </NavLink>
          </div>
        </div>

        {/* Right Side Animation */}
        <div className="flex-1">
          <Lottie animationData={animationData} loop={true} />
        </div>
      </div>
    </div>
  );
};

export default Banner;
