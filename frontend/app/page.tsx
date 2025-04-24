"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Briefcase, Star, Users } from "lucide-react"
import { useInView } from "react-intersection-observer"
// import { Canvas } from "@react-three/fiber"
// import { OrbitControls, PresentationControls, Environment } from "@react-three/drei"
import Image from "next/image"
import HeroAsideImage from './Hero-aside-image.jpg';


// 3D Model Component
// function TeamModel() {
//   // Using a custom 3D model that represents teamwork/collaboration
//   const group = useRef()

//   return (
//     <PresentationControls
//       global
//       rotation={[0.13, 0.1, 0]}
//       polar={[-0.4, 0.2]}
//       azimuth={[-1, 0.75]}
//       config={{ mass: 2, tension: 400 }}
//       snap={{ mass: 4, tension: 400 }}
//     >
//       <group ref={group} dispose={null} position={[0, -1, 0]}>
//         {/* First character */}
//         <mesh position={[-1.5, 0, 0]} castShadow receiveShadow>
//           <capsuleGeometry args={[0.5, 1, 8, 16]} />
//           <meshStandardMaterial color="#4F46E5" roughness={0.3} />
//           <mesh position={[0, 0.8, 0]} castShadow>
//             <sphereGeometry args={[0.3, 32, 32]} />
//             <meshStandardMaterial color="#4F46E5" roughness={0.3} />
//           </mesh>
//         </mesh>

//         {/* Second character */}
//         <mesh position={[0, 0, 0]} castShadow receiveShadow>
//           <capsuleGeometry args={[0.5, 1, 8, 16]} />
//           <meshStandardMaterial color="#EC4899" roughness={0.3} />
//           <mesh position={[0, 0.8, 0]} castShadow>
//             <sphereGeometry args={[0.3, 32, 32]} />
//             <meshStandardMaterial color="#EC4899" roughness={0.3} />
//           </mesh>
//         </mesh>

//         {/* Third character */}
//         <mesh position={[1.5, 0, 0]} castShadow receiveShadow>
//           <capsuleGeometry args={[0.5, 1, 8, 16]} />
//           <meshStandardMaterial color="#10B981" roughness={0.3} />
//           <mesh position={[0, 0.8, 0]} castShadow>
//             <sphereGeometry args={[0.3, 32, 32]} />
//             <meshStandardMaterial color="#10B981" roughness={0.3} />
//           </mesh>
//         </mesh>

//         {/* Connection lines between characters */}
//         <mesh position={[-0.75, 0, 0]} castShadow>
//           <cylinderGeometry args={[0.05, 0.05, 1.5, 16]} rotation={[0, 0, Math.PI / 2]} />
//           <meshStandardMaterial color="#94A3B8" roughness={0.5} />
//         </mesh>

//         <mesh position={[0.75, 0, 0]} castShadow>
//           <cylinderGeometry args={[0.05, 0.05, 1.5, 16]} rotation={[0, 0, Math.PI / 2]} />
//           <meshStandardMaterial color="#94A3B8" roughness={0.5} />
//         </mesh>

//         {/* Platform */}
//         <mesh position={[0, -1, 0]} receiveShadow>
//           <cylinderGeometry args={[3, 3, 0.2, 32]} />
//           <meshStandardMaterial color="#1E293B" roughness={0.8} />
//         </mesh>
//       </group>
//     </PresentationControls>
//   )
// }

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg card-hover"
    >
      <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </motion.div>
  )
}

export default function Home() {
  const [heroRef, heroInView] = useInView()
  // const canvasRef = useRef()

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden" ref={heroRef}>
          <div className="hero-dots absolute inset-0 z-0"></div>
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
                Connect with top <span className="gradient-text">talent</span> and exciting{" "}
                <span className="gradient-text">opportunities</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                HustleHub brings together freelancers and clients in a seamless platform designed for successful
                collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register?type=client" passHref>
                  <Button size="lg" className="w-full sm:w-auto">
                    Hire Talent <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register?type=freelancer" passHref>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Find Work
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-[400px] relative"
            >
              <Image
                src={HeroAsideImage}
                alt="Hero Background"
                layout="fill"
                objectFit="cover"
                className="object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose HustleHub?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our platform offers powerful features to maximize your freelancing success
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Star className="h-6 w-6 text-blue-600" />}
                title="Top Tier Talent"
                description="Access vetted professionals across numerous skills and specialties."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6 text-blue-600" />}
                title="Team Collaboration"
                description="Form teams for complex projects requiring diverse skills."
              />
              <FeatureCard
                icon={<Briefcase className="h-6 w-6 text-blue-600" />}
                title="Secure Payments"
                description="Milestone-based payments ensure work quality and timely delivery."
              />
              <FeatureCard
                icon={<Star className="h-6 w-6 text-blue-600" />}
                title="Project Management"
                description="Track progress, communicate, and manage your projects efficiently."
              />
              <FeatureCard
                icon={<Users className="h-6 w-6 text-blue-600" />}
                title="Detailed Profiles"
                description="Showcase your skills, experience, and portfolio to stand out."
              />
              <FeatureCard
                icon={<Briefcase className="h-6 w-6 text-blue-600" />}
                title="Subscription Plans"
                description="Choose the plan that fits your needs and take your career to the next level."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Get started in three simple steps
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create Your Account",
                  description: "Sign up as a client or freelancer and complete your profile.",
                },
                {
                  step: "02",
                  title: "Post or Find Jobs",
                  description: "Clients post jobs, freelancers apply with competitive proposals.",
                },
                {
                  step: "03",
                  title: "Collaborate & Complete",
                  description: "Work together through our platform and get paid securely.",
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full"
                  >
                    <div className="text-4xl font-bold text-blue-600 mb-4">{item.step}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
                  </motion.div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-10 w-10 text-blue-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Collaboration Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Team Up for Complex Projects</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Some projects require diverse skills and expertise. Our platform allows freelancers to form teams and
                  tackle complex projects together.
                </p>
                <ul className="space-y-4">
                  {[
                    "Create teams with complementary skills",
                    "Collaborate efficiently on large projects",
                    "Apply for team-based opportunities",
                    "Manage team roles and responsibilities",
                    "Share project resources and communications",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start"
                    >
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/freelancer/teams" passHref>
                    <Button size="lg">
                      Explore Team Features <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative h-[400px] rounded-xl overflow-hidden shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90 z-10"></div>
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-8">
                  <Users className="h-16 w-16 mb-6" />
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center">Team-Based Opportunities</h3>
                  <p className="text-center max-w-md">
                    Access exclusive projects that require team collaboration and earn more by combining your expertise
                    with other talented freelancers.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-center">
                      <div className="text-2xl font-bold">250+</div>
                      <div className="text-sm">Team Projects</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-center">
                      <div className="text-2xl font-bold">1,500+</div>
                      <div className="text-sm">Active Teams</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-center">
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-sm">Success Rate</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of freelancers and clients already using HustleHub to grow their businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register?type=client" passHref>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  I'm a Client
                </Button>
              </Link>
              <Link href="/auth/register?type=freelancer" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto"
                >
                  I'm a Freelancer
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">HustleHub</h3>
              <p className="text-gray-400">Connecting talent with opportunity worldwide.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">For Freelancers</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Find Work
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Create Profile
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Join Teams
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">For Clients</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Find Freelancers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Enterprise Solutions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2023 HustleHub. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
