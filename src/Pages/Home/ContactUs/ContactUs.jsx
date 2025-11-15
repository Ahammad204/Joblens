/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdEmail, MdPhone } from "react-icons/md";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("access_key", import.meta.env.VITE_WEB3_ACCESS_KEY);
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("message", formData.message);
    form.append("subject", `New Message from ${formData.name}`);
    form.append("custom_note", "This email was sent from Joblens 🚀");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (e) {
      toast.error("Submission failed.");
    }
  };

  return (
    <section className="py-20 px-6 lg:px-20" id="contact">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#41b39d] to-[#2ea188] bg-clip-text text-transparent">
        Contact Us
      </h2>

      <div className="grid md:grid-cols-2 gap-10 items-start mt-12 max-w-6xl mx-auto">

        {/* Contact Info Box */}
        <div className="p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-md border border-white/50">
          <p className="flex items-center gap-3 text-lg text-gray-700">
            <MdPhone className="text-2xl text-[#41b39d]" />
            Hotline:
            <a
              href="tel:+8801234567890"
              className="font-semibold hover:underline"
            >
              +8801234567890
            </a>
          </p>

          <p className="flex items-center gap-3 text-lg text-gray-700 mt-4">
            <MdEmail className="text-2xl text-[#41b39d]" />
            Email:
            <a
              href="mailto:hire.rent@gmail.com"
              className="font-semibold hover:underline"
            >
              hire.rent@gmail.com
            </a>
          </p>

          <p className="text-gray-600 mt-6 leading-relaxed">
            Have a question or need support?  
            Our team is here to assist you with your renting & earning journey.
          </p>
        </div>

        {/* Custom Contact Form */}
        <div className="p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-md border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Your Name"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41b39d]"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Your Email"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41b39d]"
            />

            <textarea
              name="message"
              value={formData.message}
              placeholder="Your Message"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 h-32 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41b39d]"
            ></textarea>

            <button
              type="submit"
              className="w-full bg-[#41b39d] hover:bg-[#369d88] text-white font-semibold py-3 rounded-lg transition cursor-pointer"
            >
              Send Message
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
