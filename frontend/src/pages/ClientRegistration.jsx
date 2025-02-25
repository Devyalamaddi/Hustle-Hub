import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link, useNavigate } from "react-router-dom";

// ✅ Form Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  companyName: yup.string().required("Company Name is required"),
  industry: yup.string().required("Industry is required"),
  contactInfo: yup.string().required("Contact Info is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ClientRegistration = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);

    // Show Success Toast Notification
    toast.success("Registration Successful!", {
      position: "top-center",
      duration: 3000,
      style: {
        background: "#22c55e",
        color: "#fff",
        fontWeight: "bold",
      },
      icon: "✅",
    });

    // Reset form after successful submission
    reset();
    navigate("/login");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-bl from-[var(--gradient-start)] to-[var(--gradient-end)]">
      <AuthImagePattern title="Join Us Today!" subtitle="Create your account and explore freelancing opportunities." />

      <div className="min-h-screen flex items-center justify-center px-6">
        <Toaster />
        <motion.div
          className="bg-[var(--card)]/10 p-10 rounded-lg shadow-lg max-w-2xl w-full"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-6">Client Registration</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div >
              <label className="block text-sm text-[var(--text-primary)]  mb-1">Full Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="John Doe"
              />
              <p className="text-[var(--error)] text-sm">{errors.name?.message}</p>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm text-[var(--text-primary)] mb-1">Industry</label>
              <input
                type="text"
                {...register("industry")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Software Development"
              />
              <p className="text-[var(--error)] text-sm">{errors.industry?.message}</p>
            </div>

            {/* Company Name */}
            <div className="col-span-2">
              <label className="block text-sm text-[var(--text-primary)]  mb-1">Company Name</label>
              <input
                type="text"
                {...register("companyName")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Tech Solutions Ltd."
              />
              <p className="text-[var(--error)] text-sm">{errors.companyName?.message}</p>
            </div>

            

            {/* Contact Info */}
            <div>
              <label className="block text-sm text-[var(--text-primary)]  mb-1">Contact Info</label>
              <input
                type="text"
                {...register("contactInfo")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="+1234567890"
              />
              <p className="text-[var(--error)] text-sm">{errors.contactInfo?.message}</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-[var(--text-primary)]  mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="client@example.com"
              />
              <p className="text-[var(--error)] text-sm">{errors.email?.message}</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-[var(--text-primary)]  mb-1">Password</label>
              <input
                type="password"
                {...register("password")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="********"
              />
              <p className="text-[var(--error)] text-sm">{errors.password?.message}</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-[var(--text-primary)]  mb-1">Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="********"
              />
              <p className="text-[var(--error)] text-sm">{errors.confirmPassword?.message}</p>
            </div>

            {/* Submit Button */}
            <div className="col-span-2 mx-auto">
              <motion.button
                type="submit"
                className="w-full bg-[var(--card)] bg-opacity-30 text-[var(--text-primary)] hover:bg-[color-mix(in srgb, var(--primary) 40%, transparent)] px-6 py-3 rounded-3xl font-bold shadow-lg transition-color "
                whileHover={{ scale: 1.05 }}
              >
                Register
              </motion.button>
            </div>
          </form>

          <p className="text-[var(--text-primary)] text-sm text-center mt-3">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[var(--primary)] hover:text-[var(--text-secondary)] font-semibold transition duration-300"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientRegistration;
