import React, { useState } from "react";

function PostGigForm({ onClose }) {
  const [gigTitle, setGigTitle] = useState("");
  const [gigDescription, setGigDescription] = useState("");
  const [gigBudget, setGigBudget] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulating a POST request
    console.log({
      title: gigTitle,
      description: gigDescription,
      budget: gigBudget,
    });

    alert("Gig Posted Successfully!");
    onClose(); // Close the form after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[var(--card)] p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">Post a Gig</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[var(--text-primary)]">Gig Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter gig title"
              value={gigTitle}
              onChange={(e) => setGigTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[var(--text-primary)]">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Describe the gig"
              value={gigDescription}
              onChange={(e) => setGigDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-[var(--text-primary)]">Budget ($)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Enter budget"
              value={gigBudget}
              onChange={(e) => setGigBudget(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-400 text-white rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-blue-700"
            >
              Submit Gig
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostGigForm;
