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
import FreelancerSubscriptionsPage from './pages/FreelancerSubscriptionsPage';
import ClientSubscriptionPage from './pages/ClientSubscriptionPage';

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
      {
        path: 'client/subscription',
        element: <ClientSubscriptionPage />,
      },
      {
        path: 'freelancer/subscription',
        element: <FreelancerSubscriptionsPage />,
      }
      // {
      //   path:'home',
      //   element: <FreelancerHome />
      // }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
