"use client"

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { User } from 'lucide-react';
import { format } from "date-fns";
import { useRouter } from 'next/navigation';

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/client-api/clients`);
        if (!response.ok) {
          throw new Error(`Error fetching clients: ${response.statusText}`);
        }
        const data: Client[] = await response.json();
        setClients(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <div>Loading clients...</div>;
  if (error) return <div>Error loading clients: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Clients List</h1>
      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(client => (
            <motion.div key={client._id} variants={itemVariants} initial="hidden" animate="show">
              <Card className="overflow-hidden" onClick={()=>router.push(`/freelancer/clients/${client._id}`)}>
                <div className="bg-muted px-4 py-2 flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    <User size={14} />
                    {client.companyName || 'Company'}
                  </span>
                  
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {client.industry} • {client.email}
                  </CardDescription>
                </CardHeader>

                <div className="px-6 pb-4 text-sm space-y-1">
                  <p><span className="font-semibold">Contact:</span> {client.contactInfo}</p>
                  <p><span className="font-semibold">Balance:</span> ${client.balance}</p>
                  <p><span className="font-semibold">Certifications:</span> {client.certifications.join(', ') || 'None'}</p>
                  <p><span className="font-semibold">Reported:</span> {client.reportedCount} times</p>
                  <p><span className="font-semibold">Subscription Duration:</span> {client.subscriptionDurationInDays} days</p>
                </div>

                <CardFooter className="flex justify-between text-xs text-muted-foreground px-6 pb-4">
                    <span>Client since {new Date(client.createdAt).getFullYear()}</span>
                    <span>Last updated in {format(new Date(client.updatedAt), 'MMMM yyyy')}</span>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
