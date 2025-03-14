import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import AuthImagePattern from "../components/AuthImagePattern"; // Import the updated component
import { Link, Navigate, useNavigate } from "react-router-dom";

// ✅ Form Validation Schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
  role: yup.string().oneOf(["freelancer", "client"], "Please select a role").required("Role is required"),
});

const CommonLoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    toast.success(`Logged in as ${data.role}`, { position: "top-center" });
    localStorage.setItem("type", data.role);
    reset();
    navigate(`/${data.role}/dashboard`);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-bl from-[var(--gradient-start)] to-[var(--gradient-end)]">
      
      {/* Left Side: Login Form */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <Toaster /> 
        <motion.div
          className="bg-[var(--card)]/10 p-10 rounded-lg shadow-lg max-w-2xl w-full "
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-6">Login</h2>

          {/* Form Start */}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
            {/* Email Input */}
            <div>
              <label className="block text-[var(--text-primary)] mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full mt-3 p-3 rounded-xl  bg-[var(--card)]/70 focus:outline-none  "
                placeholder="client@mail.com"
              />
              <p className="text-[var(--error)] text-sm">{errors.email?.message}</p>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[var(--text-primary)] ">Password</label>
              <input
                type="password"
                {...register("password")}
                className="w-full mt-3 p-3 rounded-xl  bg-[var(--card)]/70 focus:outline-none "
                placeholder="********"
              />
              <p className="text-[var(--error)] text-sm">{errors.password?.message}</p>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[var(--text-primary)]  mb-2">Login As:</label>
              <div className="flex space-x-4">
                {/* Freelancer Radio */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="freelancer"
                    {...register("role")}
                    className="hidden"
                    onClick={() => setSelectedRole("freelancer")}
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
                      ${selectedRole === "freelancer" ? "bg-[var(--primary)]" : "bg-[var(--card)]"} 
                      border-[var(--primary)]`}
                    
                  >
                    {selectedRole === "freelancer" && <div className="w-2.5 h-2.5 bg-[var(--card)] rounded-full"></div>}
                  </div>
                  <span className="text-[var(--text-primary)]">Freelancer</span>
                </label>

                {/* Client Radio */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="client"
                    {...register("role")}
                    className="hidden"
                    onClick={() => setSelectedRole("client")}
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedRole === "client" ? "bg-[var(--primary)]" : "bg-[var(--card)]"}
                    border-[var(--primary)]`}
                  >
                    {selectedRole === "client" && <div className="w-2.5 h-2.5 bg-[var(--card)] rounded-full"></div>}
                  </div>
                  <span className="text-[var(--text-primary)]">Client</span>
                </label>
              </div>
              <p className="text-[var(--error)] text-sm">{errors.role?.message}</p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-30 mx-auto bg-[var(--card)] bg-opacity-30 text-[var(--text-primary)] hover:bg-[color-mix(in srgb, var(--primary) 40%, transparent)] px-6 py-3 rounded-3xl font-bold shadow-lg transition"
              whileHover={{ scale: 1.05 }}
            >
              Login
            </motion.button>
          </form>
          <p className="text-[var(--text-primary)] text-sm mt-4 text-center">
            New to Website?{" "}
            <Link
              to="/freelancer/register"
              className="text-[var(--success)] hover:text-[var(--success-hover)] font-semibold transition duration-300"
            >
              Become a Freelancer
            </Link>{" "}
            or{" "}
            <Link
              to="/client/register"
              className="text-[var(--warning)] hover:text-[var(--warning-hover)] font-semibold transition duration-300"
            >
              Become a Client
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side: Auth Image & Icons Panel */}
      <AuthImagePattern title="Welcome Back!" subtitle="Sign in to access your freelance world." />

    </div>
  );
};

export default CommonLoginPage;
