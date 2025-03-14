import React from "react";

const subscriptionPlans = [
  {
    id: "1",
    planType: "Beginner Boost",
    price: "₹199",
    duration: "30 Days",
    isOneTime: true,
    serviceFee: "5%",
    support: "Limited Support",
    features: [
      "5 job applications per week",
      "Limited team-based gig access (max 2 teams)",
      "Basic profile verification badge",
      "Access to free learning resources"
    ]
  },
  {
    id: "2",
    planType: "Pro",
    price: "₹499",
    duration: "30 Days",
    isOneTime: false,
    serviceFee: "3%",
    support: "Priority Support",
    features: [
      "20 job applications per week",
      "Unlimited team-based gig access",
      "Advanced profile verification badge",
      "Portfolio & Resume Builder",
      "Discounted access to skill-based certifications"
    ]
  },
  {
    id: "3",
    planType: "Premium Pro",
    price: "₹999",
    duration: "30 Days",
    isOneTime: false,
    serviceFee: "1%",
    support: "24/7 Dedicated Support",
    features: [
      "Unlimited job applications",
      "AI-powered proposal assistance",
      "Featured Freelancer Listing",
      "Direct job invitations from verified clients"
    ]
  }
];

function FreelancerSubscriptionsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[var(--background)] text-[var(--text-primary)]">
      <h2 className="text-3xl font-bold text-center mb-6">Freelancer Subscription Plans</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className="border p-6 rounded-lg shadow-lg bg-[var(--card)]">
            <h3 className="text-xl font-bold text-[var(--primary)]">{plan.planType}</h3>
            <p className="text-lg font-semibold mt-2">{plan.price} / {plan.duration}</p>
            <p className="text-sm text-[var(--text-secondary)]">
              {plan.isOneTime ? "One-time payment" : "Recurring payment"}
            </p>
            <p className="text-sm mt-2">Service Fee: <strong>{plan.serviceFee}</strong></p>
            <p className="text-sm">Support: <strong>{plan.support}</strong></p>
            <h4 className="font-semibold mt-4">Features:</h4>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)]">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button className="mt-4 w-full bg-[var(--primary)] text-white py-2 rounded-md hover:bg-opacity-80">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FreelancerSubscriptionsPage;
