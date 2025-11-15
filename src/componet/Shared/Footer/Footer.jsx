import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import logo from "../../../assets/FooterLogo.png";

const Footer = () => {
  return (
    <footer className=" py-12 px-6 md:px-20">
      <div className="grid md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">

        {/* Logo & Tagline */}
        <div>
          <img src={logo} alt="Logo" className="w-36 mb-4" />
          <p className="text-sm leading-relaxed">
            Connecting talented professionals with their dream jobs.  
            Explore and apply today!
          </p>
        </div>

        {/* Job Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#41b39d]">Job Portal</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-[#41b39d] transition">Home</a>
            </li>
            <li>
              <a href="/allJobs" className="hover:text-[#41b39d] transition">All Jobs</a>
            </li>
            <li>
              <a href="/allResources" className="hover:text-[#41b39d] transition">Resources</a>
            </li>
            {/* <li>
              <a href="/contact" className="hover:text-[#41b39d] transition">Contact</a>
            </li> */}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#41b39d]">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#41b39d] transition"><FaFacebook size={22} /></a>
            <a href="#" className="hover:text-[#41b39d] transition"><FaTwitter size={22} /></a>
            <a href="#" className="hover:text-[#41b39d] transition"><FaInstagram size={22} /></a>
            <a href="#" className="hover:text-[#41b39d] transition"><FaLinkedin size={22} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} JobPortal. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
