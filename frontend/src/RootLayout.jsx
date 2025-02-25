import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <div className="bg-gradient-to-bl from-[var(--gradient-start)] to-[var(--gradient-end)]">
        <Navbar/>
        <div style={{minHeight:'100vh'}}>
            <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default RootLayout