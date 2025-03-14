import React from "react";

const mockSubscriptions = [
  {
    _id: "67b5d8d36ea3454876456d40",
    planType: "Client Business - 1 Month",
    features: [
      "Unlimited job postings",
      "AI-powered freelancer matching",
      "5% commission on payments",
      "Bulk project management dashboard",
      "Priority support",
    ],
    price: 799,
    isOneTime: false,
    duration: "30 Days",
    for: "Client",
  },
  {
    _id: "67b5d9066ea3454876456d42",
    planType: "Client Business - 6 Months",
    features: [
      "Unlimited job postings",
      "AI-powered freelancer matching",
      "5% commission on payments",
      "Bulk project management dashboard",
      "Priority support",
    ],
    price: 4199,
    isOneTime: false,
    duration: "180 Days",
    for: "Client",
  },
  {
    _id: "67b5d9196ea3454876456d43",
    planType: "Client Enterprise",
    features: [
      "Dedicated account manager",
      "0% commission on payments",
      "API access for hiring automation",
      "Exclusive access to verified freelancers",
      "Contract-based hiring & NDAs",
    ],
    price: 8499,
    isOneTime: false,
    duration: "90 Days",
    for: "Client",
  },
];

function ClientSubscriptionPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[var(--background)] text-[var(--text-primary)]">
      <h1 className="text-3xl font-bold text-center mb-6">Client Subscription Plans</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSubscriptions.map((plan) => (
          <div
            key={plan._id}
            className="bg-[var(--card)] shadow-md rounded-lg p-6 border border-[var(--text-secondary)]"
          >
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">{plan.planType}</h2>
            <p className="text-[var(--text-secondary)] mt-1">{plan.duration}</p>
            <p className="text-lg font-bold text-[var(--primary)] mt-2">₹{plan.price}</p>
            <ul className="mt-4 text-sm text-[var(--text-primary)] space-y-1">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  ✅ <span className="ml-2">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full bg-[var(--primary)] text-white py-2 rounded-md hover:brightness-110">
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientSubscriptionPage;
