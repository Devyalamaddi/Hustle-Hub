import React from 'react'

const ClientProfile = () => {
    const currentClient = [
        {
            "_id":{
                "$oid":"67bf0c889a551c001d145e28",
            },
            "name":"Dev-Client",
            "companyName":"company-dev",
            "industry":"industry-dev",
            "contactInfo":"contact@company.dev.in",
            "email":"dev@client.com",
            "role":"client",
            "certifications":[
                "certificate-1",
                "certificate-2"
            ],
            "subscriptionStatus":true,
            "balance":{
                "$numberInt":"0"
            },
            "subscriptionId":{
                "$oid":"67b5d9196ea3454876456d43"
            },
            "subscriptionDurationInDays":{
                "$numberInt":"90"
            },
            "reportedCount":{
                "$numberInt":"2"
            },
            "createdAt":{
                "$date":{
                    "$numberLong":"1740069124163"
                }
            },
            "updatedAt":{
                "$date":{
                    "$numberLong":"1740072250958"
                }
            },
        }]
  return (
    <>
        <div class name="text-[var(--primary)] text-2xl font-semibold mt-4 text-center">Client Profile</div>
        <div className="client-profile">
            <h1 className="text-[var(--primary)] text-2xl font-semibold mt-4">{currentClient[0].name}</h1>
            <p className="text-[var(--text-secondary)]"><strong>Company Name:</strong> {currentClient[0].companyName}</p>
            <p className="text-[var(--text-secondary)]"><strong>Industry:</strong> {currentClient[0].industry}</p>
            <p className="text-[var(--text-secondary)]"><strong>Contact Info:</strong> {currentClient[0].contactInfo}</p>
            <p className="text-[var(--text-secondary)]"><strong>Email:</strong> {currentClient[0].email}</p>
            <p className="text-[var(--text-secondary)]"><strong>Role:</strong> {currentClient[0].role}</p>
            <p className="text-[var(--text-secondary)]"><strong>Certifications:</strong> {currentClient[0].certifications.join(', ')}</p>
            <p className="text-[var(--text-secondary)]"><strong>Subscription Status:</strong> {currentClient[0].subscriptionStatus ? 'Active' : 'Inactive'}</p>
            <p className="text-[var(--text-secondary)]"><strong>Balance:</strong> {currentClient[0].balance.$numberInt}</p>
            <p className="text-[var(--text-secondary)]"><strong>Subscription ID:</strong> {currentClient[0].subscriptionId.$oid}</p>
            <p className="text-[var(--text-secondary)]"><strong>Subscription Duration (Days):</strong> {currentClient[0].subscriptionDurationInDays.$numberInt}</p>
            <p className="text-[var(--text-secondary)]"><strong>Reported Count:</strong> {currentClient[0].reportedCount.$numberInt}</p>
            <p className="text-[var(--text-secondary)]"><strong>Created At:</strong> {new Date(parseInt(currentClient[0].createdAt.$date.$numberLong)).toLocaleString()}</p>
        </div>
    </>
  )
}

export default ClientProfile