import React from "react";
import bannerImg from "../../../assets/ctcbanner.png";

const CallToAction = () => {
  return (
    <section
      className="relative py-24 my-10 text-white overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerImg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 shadow-xl">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Build Your Future With the Right Opportunity 💼
          </h2>

          <p className="text-lg text-gray-200">
            Discover verified jobs, training programs, and skill-building opportunities. 
            Whether you're starting your career or leveling up — we help you move forward.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
