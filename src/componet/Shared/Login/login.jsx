import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import toast from "react-hot-toast";
import loginAnimation from "../../../assets/Login.json";
import useAuth from "../../../Hooks/useAuth";



const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      if (res?.status === 200) {
        toast.success("Login successful!");
        navigate("/");
      }
    } catch (err) {
      toast.error("Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-0">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center rounded-2xl p-6 md:p-12">
        
        {/* Left side animation */}
        <div className="hidden md:block">
          <Lottie animationData={loginAnimation} loop />
        </div>

        {/* Right side form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 shadow rounded-lg space-y-4 bg-base-100"
        >
          <h2 className="text-2xl font-bold text-center text-[#0fb894]">
            Welcome Back 
          </h2>
          <p className="text-center text-gray-500 mb-4">
            Login to your account to continue
          </p>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={formData.email}
            required
            className="input input-bordered w-full"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            required
            className="input input-bordered w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn text-white bg-[#0fb894] outline-none border-none w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center mt-4">
            <p>
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#0fb894] font-bold">
                Register
              </Link>
            </p>
     
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;