import React from "react";
import featured1 from "../../assets/featured1.png";
import featured2 from "../../assets/featured2.png";
import featured3 from "../../assets/featured3.png";
import SectionTitle from "../../Shared/SectionTitle/SectionTitle";

const FeaturedSection = () => {
  return (
    <div className="mx-auto px-6 py-16">
      <SectionTitle title={"Featured Listings"}></SectionTitle>

      {/* Grid of Featured Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg hover:scale-105 transition">
          <img
            src={featured1}
            alt="Featured Task"
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-2">
              Need Help with Grocery Shopping
            </h3>
            <p className="text-gray-600 mb-4">
              Hire someone to get your groceries delivered quickly.
            </p>
            <button className="px-4 py-2 bg-[#0fb894] cursor-pointer text-white rounded-lg
             transition">
              View Details
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg hover:scale-105 transition">
          <img
            src={featured2}
            alt="Featured Item"
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-2">DSLR Camera for Rent</h3>
            <p className="text-gray-600 mb-4">
              Capture amazing photos with a professional camera.
            </p>
            <button className="px-4 py-2 bg-[#0fb894] cursor-pointer text-white rounded-lg
             transition">
              Rent Now
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg hover:scale-105 transition">
          <img
            src={featured3}
            alt="Featured Vehicle"
            className="w-full h-48 object-cover"
          />
          <div className="p-5">
            <h3 className="text-xl font-semibold mb-2">
              Bike for Daily Commute
            </h3>
            <p className="text-gray-600 mb-4">
              Affordable bike rentals available in your area.
            </p>
            <button
              className="px-4 py-2 bg-[#0fb894]
             text-white rounded-lg cursor-pointer transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;
