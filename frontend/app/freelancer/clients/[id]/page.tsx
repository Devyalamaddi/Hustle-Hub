"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface Client {
  _id: string;
  name: string;
  companyName: string;
  industry: string;
  contactInfo: string;
  email: string;
  subscriptionStatus: boolean;
  balance: number;
  certifications: string[];
  subscriptionDurationInDays: number;
  reportedCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ClientPageProps {
  params: {
    id: string;
  };
}

const ClientPage: React.FC<ClientPageProps> = ({ params }) => {
  const [paramId, setParamId] = useState<string | null>(null);
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap the params object using useEffect
  useEffect(() => {
    if (params?.id) {
      // Resolve the param ID and store it in state
      setParamId(params.id);
    }
  }, [params]);

  useEffect(() => {
    if (paramId) {
      const fetchClient = async () => {
        try {
          const response = await fetch(`https://hustle-hub-backend.onrender.com/client-api/clients/${paramId}`);
          if (!response.ok) {
            throw new Error(`Error fetching client: ${response.statusText}`);
          }
          const data: Client = await response.json();
          setClient(data);
        } catch (err: any) {
          setError(err.message || 'Unknown error');
        } finally {
          setLoading(false);
        }
      };

      fetchClient();
    }
  }, [paramId]);

  if (loading) {
    return <div>Loading client details...</div>;
  }

  if (error) {
    return <div>Error loading client details: {error}</div>;
  }

  if (!client) {
    return <div>No client found.</div>;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.push('/freelancer/clients')}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex justify-center items-center gap-2"
      >
        <ArrowLeft /> Back to Clients
      </button>
      <h1 className="text-2xl font-bold mb-4">Client Details</h1>
      <div className="space-y-2">
        <p><strong>Name:</strong> {client.name}</p>
        <p><strong>Company:</strong> {client.companyName}</p>
        <p><strong>Industry:</strong> {client.industry}</p>
        <p><strong>Contact Info:</strong> {client.contactInfo}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Subscription Status:</strong> {client.subscriptionStatus ? 'Active' : 'Inactive'}</p>
        <p><strong>Balance:</strong> {client.balance}</p>
        <p><strong>Certifications:</strong> {client.certifications.join(', ')}</p>
        <p><strong>Reported Count:</strong> {client.reportedCount}</p>
        <p><strong>Subscription Duration (days):</strong> {client.subscriptionDurationInDays}</p>
        <p><strong>Created At:</strong> {new Date(client.createdAt).toLocaleDateString()}</p>
        <p><strong>Updated At:</strong> {new Date(client.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ClientPage;
