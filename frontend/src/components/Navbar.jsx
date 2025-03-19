import React ,{ useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import DarkModeToggle from '../ui/DarkModeToggle';

function Navbar() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [type, setType] = useState(localStorage.getItem("type"));

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className=" text-[var(--text-primary)]">
      <header className="p-5 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          <Link to="/">FreelanceHub</Link>
        </h1>
        <nav>
          {
            type=="freelancer" && <Link to="/freelancer/home" className="mx-4 text-lg text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300">Home</Link>
          }
          <Link to="/login" className="mx-4 text-lg text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300">Login</Link>
          <Link href="/about" className="mx-4 text-lg text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300">About </Link>
          {/* <Link href="#" className="mx-4 text-lg text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300">Get Started</Link> */}
          <Link to={`/${type}/subscription`} className="mx-4 text-lg text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300">Subscriptions</Link>
          <Link to={`/${type}/dashboard`} className="mx-4 text-lg text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300">Dashboard</Link>
        
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />


        </nav>
    </header>
    </div>
  )
}

export default Navbar