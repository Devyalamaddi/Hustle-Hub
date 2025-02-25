import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './RootLayout';
import LandingPage from './pages/LandingPage';
import ClientRegistration from './pages/ClientRegistration';
import FreelancerRegistration from './pages/FreelancerRegistration';
import FreelancerHome from './pages/FreelancerHome';
import ClientDashboard from './pages/ClientDashboard';
import CommonLoginPage from './pages/CommonLoginPage';
import FreelancerDashboard from './pages/FreelancerDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path:'', element: <LandingPage /> },
      { path: 'login', element: <CommonLoginPage /> },
      { path: 'client/register', element: <ClientRegistration /> },
      { 
        path: 'client/dashboard', 
        element: <ClientDashboard />,
      },
      { path: 'freelancer/register', element: <FreelancerRegistration /> },
      { path: 'freelancer/home', element: <FreelancerHome /> },
      { 
        path: 'freelancer/dashboard',
        element: <FreelancerDashboard/>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
