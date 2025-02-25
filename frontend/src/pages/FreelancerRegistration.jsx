import React from 'react'
import AuthImagePattern from '../components/AuthImagePattern'
import { Toaster } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {useForm} from 'react-hook-form';

function FreelancerRegistration() {
  const {handleSubmit,register, formState:{errors}, reset} = useForm();
  const navigate = useNavigate();

  const handleRegister=(formData)=>{
    // e.preventDefault()
    // const formData = new FormData(e.target)
    const skills= formData.skills.split(',');
    formData.skills=skills;
    console.log("Form Data is ",formData);
    reset();
    navigate('/login')
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-bl from-[var(--gradient-start)] to-[var(--gradient-end)]">
      <AuthImagePattern title="Join Us Today!" subtitle="Create your account and explore freelancing opportunities." />
      <div className="max-h-screen flex items-center justify-center px-6">
        <Toaster />
        <motion.div
          className="bg-[var(--card)]/10 p-10 rounded-lg shadow-lg max-w-2xl w-full"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-6">Freelancer Registration</h2>

          <form onSubmit={handleSubmit(handleRegister)} className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div >
              <label className="block text-sm text-[var(--text-primary)]  mb-1">Full Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="John Doe"
              />
              <p className="text-[var(--error)] text-sm">{errors?.name?.message}</p>
            </div>

            {/* Certifications */}
            {/* <div>
              <label className="block text-sm text-[var(--text-primary)] mb-1">Certifications</label>
              <input
                type="text"
                {...register("certifications")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Certification 1, Certification 2"
              />
              <p className="text-[var(--error)] text-sm">{errors?.certifications?.message}</p>
            </div> */}

            {/* Skills */}
            <div>
              <label className="block text-sm text-[var(--text-primary)] mb-1">Skills</label>
              <input
                type="text"
                {...register("skills")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Skill 1, Skill 2"
              />
              <p className="text-[var(--error)] text-sm">{errors?.skills?.message}</p>
            </div>

            {/* Experience */}
            <div className="col-span-2">
              <label className="block text-sm text-[var(--text-primary)] mb-1">Experience</label>
              <input
                type="text"
                {...register("experience")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Describe your experience"
              />
              <p className="text-[var(--error)] text-sm">{errors?.experience?.message}</p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-[var(--text-prim)] mb-1">Role</label>
              <input
                type="text"
                {...register("role")}
                className="w-full p-3 rounded-xl bg-[var(--card)]/70 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Your role"
              />
              <p className="text-[var(--error)] text-sm">{errors?.role?.message}</p>
            </div>

            {/* Subscription Status */}
            {/* <div className="col-span-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  {...register("subscriptionStatus")}
                  className="form-checkbox h-5 w-5 text-[var(--primary)]"
                />
                <span className="ml-2 text-sm text-[var(--text-primary)]">Subscribe to newsletter</span>
              </label>
            </div> */}


            {/* Balance */}
            {/* <input type="hidden" {...register("balance")} value="0" /> */}

            {/* Reported Count */}
            {/* <input type="hidden" {...register("reportedCount")} value="0" /> */}

            {/* Subscription ID */}
            {/* <input type="hidden" {...register("subscriptionId")} /> */}

            {/* Submit Button */}
            <div className="col-span-2 mx-auto">
              <motion.button
                type="submit"
                className="cursor-pointer w-full bg-[var(--card)] bg-opacity-30 text-[var(--text-primary)] hover:bg-[color-mix(in srgb, var(--primary) 40%, transparent)] px-6 py-3 rounded-3xl font-bold shadow-lg transition-color "
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

      {/* <AuthImagePattern title="Join Us Today!" subtitle="Create your account and explore freelancing opportunities." /> */}
    </div>
  )
}

export default FreelancerRegistration
