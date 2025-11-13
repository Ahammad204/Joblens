import React, { useState } from "react";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import { Link, useNavigate } from "react-router-dom";
import registerAnimation from "../../../assets/Login.json";
import axios from "axios";
import useAuth from "../../../Hooks/useAuth";


const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    education: "",
    experience: "",
    careerTrack: "",
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, education, experience, careerTrack, avatar } =
      formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      let avatarUrl = "";

      // Upload avatar if selected
      if (avatar) {
        const imageData = new FormData();
        imageData.append("image", avatar);

        const imgbbRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
          imageData
        );

        avatarUrl = imgbbRes.data.data.url;
      }

      const userData = {
        name,
        email,
        passwordHash: password,
        education,
        experience,
        careerTrack,
        role: "user",
        avatarUrl,
        createdAt: new Date().toISOString(),
      };

      const res = await register(userData);

      if (res?.status === 200 || res?.status === 201) {
        toast.success("Registration successful!");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          education: "",
          experience: "",
          careerTrack: "",
          avatar: null,
        });
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-0">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center rounded-2xl p-6 md:p-12">
        <div>
          <Lottie animationData={registerAnimation} loop />
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 shadow rounded-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-[#0fb894]">
            Register
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
            required
            className="input input-bordered w-full"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            required
            className="input input-bordered w-full"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              required
              className="input input-bordered w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
              className="input input-bordered w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <input
            type="text"
            name="education"
            placeholder="Education Level / Department"
            onChange={handleChange}
            value={formData.education}
            required
            className="input input-bordered w-full"
          />

          <select
            name="experience"
            onChange={handleChange}
            value={formData.experience}
            required
            className="select select-bordered w-full"
          >
            <option value="">Select Experience Level</option>
            <option value="Fresher">Fresher</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
          </select>

          <select
            name="careerTrack"
            onChange={handleChange}
            value={formData.careerTrack}
            required
            className="select select-bordered w-full"
          >
            <option value="">Preferred Career Track</option>
            <option value="Web Development">Web Development</option>
            <option value="Data">Data</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="AI/ML">AI / ML</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Others">Others</option>
          </select>

          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
          />

          <button
            type="submit"
            className="btn text-white bg-[#0fb894] outline-none border-none w-full"
          >
            Register
          </button>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link className="text-[#0fb894] font-bold" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
