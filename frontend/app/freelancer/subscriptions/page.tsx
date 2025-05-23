'use client';

import React, { useState, useEffect } from 'react';

interface SubscriptionPlan {
  planType: 'beginner_boost' | 'basic' | 'pro';
  for: string;
  features: string[];
  price: number;
  isOneTime: boolean;
  duration: number;
}

const SubscriptionPage = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/freelancer-api/subscriptions`);
        const data = await response.json();
        setSubscriptionPlans(data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  /**
   * Formats the plan type for display by capitalizing and replacing underscores
   */
  const formatPlanType = (planType: string): string => {
    return planType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscription Details</h1>
        <p className="text-gray-600">Choose the subscription plan that best fits your needs</p>
      </header>

      {subscriptionPlans.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">Loading subscription plans...</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-gray-50 p-6 rounded-t-lg border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                  {formatPlanType(plan.planType)}
                </h2>
                <p className="text-gray-600 mb-4">{plan.for}</p>
                <p className="text-gray-800 font-bold text-xl">
                  ${plan.price.toFixed(2)}
                  <span className="text-gray-500 text-base font-normal ml-1">
                    {plan.isOneTime ? '(One-time payment)' : `per ${plan.duration} ${plan.duration === 1 ? 'month' : 'months'}`}
                  </span>
                </p>
              </div>
              
              <div className="p-6">
                <h3 className="font-medium text-gray-700 mb-3">Features:</h3>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300">
                  Select Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;