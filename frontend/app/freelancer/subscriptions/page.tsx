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
        const response = await fetch('http://localhost:8080/freelancer-api/subscriptions');
        const data = await response.json();
        setSubscriptionPlans(data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Subscription Details</h1>
      {subscriptionPlans.length > 0 ? (
        subscriptionPlans.map((plan, index) => (
          <div key={index} className="border rounded-lg p-6 shadow-md mb-4">
            <h2 className="text-2xl font-semibold mb-2 capitalize">
              {plan.planType.replace('_', ' ')}
            </h2>
            <p className="mb-2">
              <strong>For:</strong> {plan.for}
            </p>
            <p className="mb-2">
              <strong>Price:</strong> ${plan.price.toFixed(2)}{' '}
              {plan.isOneTime ? '(One-time payment)' : `per ${plan.duration} month(s)`}
            </p>
            <div className="mb-2">
              <strong>Features:</strong>
              <ul className="list-disc list-inside">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <p>Loading subscription plans...</p>
      )}
    </div>
  );
};

export default SubscriptionPage;
