import React ,{ useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

function Navbar() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

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
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">FreelanceHub</h1>
        <nav>
          <Link to="#features" className="mx-4 text-lg text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300">Features</Link>
          <Link href="#about" className="mx-4 text-lg text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300">About </Link>
          <Link href="#cta" className="mx-4 text-lg text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300">Get Started</Link>
        
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`text-white px-4 py-2 rounded-lg ${
              darkMode ? 'bg-white/50 text-black' : 'bg-gray-600'
            }`}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </nav>
    </header>
    </div>
  )
}

export default Navbar