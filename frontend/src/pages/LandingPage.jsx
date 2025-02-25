import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaRocket, FaBriefcase } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    const heroSection = document.getElementById('signup');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, []);

  return (
    <div className=" text-[var(--text-primary)] min-h-screen">

      {/* Hero Section */}
      <section id="signup" className="flex flex-col items-center justify-center text-center p-10">
        <motion.h1 
          className="text-5xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}>
          The Future of <span className="text-[var(--primary)]">Freelancing</span> is Here!
        </motion.h1>
        
        <motion.p 
          className="text-lg mt-4 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}>
          Connect, Collaborate, and Grow with the most advanced freelancing platform.
        </motion.p>

        <div  className="mt-8 flex space-x-4">
          <motion.a 
            href="/client/register"
            className={`px-6 py-3 bg-[var(--primary)] hover:bg-opacity-80 text-[var(--text-primary)] rounded-lg font-semibold shadow-lg transition-all ${isHeroVisible ? 'animate-attention' : ''}`}
            whileHover={{ scale: 1.05 }}>
            Hire a Freelancer
          </motion.a>

          <motion.a 
            href="/freelancer/register"
            className={`px-6 py-3 bg-[var(--success)] hover:bg-opacity-80 text-[var(--text-primary)] rounded-lg font-semibold shadow-lg transition-all ${isHeroVisible ? 'animate-attention' : ''}`}
            whileHover={{ scale: 1.05 }}>
            Become a Freelancer
          </motion.a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <h2 className="text-4xl text-center font-bold">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-10 px-10 mt-10">
          <FeatureCard icon={<FaUsers />} title="Team-Based Projects" desc="Work in teams or collaborate for bigger gigs." />
          <FeatureCard icon={<FaBriefcase />} title="Milestone Payments" desc="Get paid securely with our escrow system." />
          <FeatureCard icon={<FaRocket />} title="Verified Certifications" desc="Boost your profile with skill-based verifications." />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[var(--card)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold">About Our Platform</h2>
          <p className="mt-5 text-lg">We bring clients and freelancers together in a secure, efficient, and modern way.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-20 text-center">
        <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
        <p className="text-lg mt-3">Join thousands of freelancers and clients working together.</p>
      
        <div className="mt-6">
          <motion.a 
            href="#signup" 
            className="px-6 py-3 bg-[var(--primary)] hover:bg-opacity-80 text-[var(--text-primary)] rounded-lg font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            Sign Up Now
          </motion.a>
        </div>
      </section>


    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    className="bg-[var(--background)] p-6 rounded-lg shadow-lg text-center"
    whileHover={{ scale: 1.05 }}>
    <div className="text-[var(--primary)] text-4xl">{icon}</div>
    <h3 className="text-xl font-bold mt-3">{title}</h3>
    <p className="mt-2 text-[var(--text-secondary)]">{desc}</p>
  </motion.div>
);

export default LandingPage;
