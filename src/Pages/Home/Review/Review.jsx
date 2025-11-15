import React, { useEffect, useState } from "react";
import SectionTitle from "../../Shared/SectionTitle/SectionTitle";

// Sample reviews for Hire & Rent Marketplace
const reviews = [
  {
    id: 1,
    name: "Rasel Ahamed",
    role: "Task Poster",
    text: "I posted a grocery shopping task and got multiple offers quickly. The process was seamless!",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Awlad Hossin",
    role: "Renter",
    text: "I rented a DSLR camera for a weekend shoot. Booking and payment were super smooth.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Nasir Uddin",
    role: "Tasker",
    text: "Completed errands for multiple users this week. The app made it easy to manage tasks and payments.",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "Sadia Khatun",
    role: "Item Owner",
    text: "I listed my bike for rent and got bookings almost immediately. The platform is trustworthy and efficient.",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 5,
    name: "Mehedi Hasan",
    role: "Task Poster",
    text: "Posting tasks and managing offers is very convenient. I can focus on getting work done, not chasing workers.",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

const Review = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) setItemsPerPage(1);
      else setItemsPerPage(3);
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? reviews.length - itemsPerPage : prev - itemsPerPage
    );
  };

  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev + itemsPerPage >= reviews.length ? 0 : prev + itemsPerPage
    );
  };

  const currentReviews = reviews.slice(activeIndex, activeIndex + itemsPerPage);

  return (
    <section className="py-16 bg-gray-50">
      <SectionTitle
        title={"What Our Users Say"}
        
      />

      <div className="flex justify-center items-center gap-6 mt-10 relative overflow-hidden">
        {currentReviews.map((review) => (
          <div
            key={review.id}
            className="transition-all duration-500 p-6 rounded-2xl shadow-lg w-[300px] min-h-[280px] bg-white"
          >
            <p className="text-4xl text-[#0fb894] mb-2">“</p>
            <p className="text-gray-700 text-sm mb-4 border-b border-dashed pb-4">
              {review.text}
            </p>

            <div className="flex items-center gap-3 mt-4">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#0fb894]"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{review.name}</h4>
                <p className="text-xs text-gray-500">{review.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={prevSlide}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#0fb894] bg-white  cursor-pointer transition"
        >
          ←
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(reviews.length / itemsPerPage) }).map(
            (_, i) => (
              <span
                key={i}
                onClick={() => setActiveIndex(i * itemsPerPage)}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  activeIndex / itemsPerPage === i
                    ? "bg-[#0fb894]"
                    : "bg-gray-400"
                }`}
              ></span>
            )
          )}
        </div>

        <button
          onClick={nextSlide}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#0fb894] bg-white cursor-pointer  transition"
        >
          →
        </button>
      </div>
    </section>
  );
};

export default Review;
