// "use client";

// import React, { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { useAuth } from "@/context/AuthContext";
// import axios from "axios";

// interface Partnership {
//   id: number;
//   title: string;
//   description: string;
//   commission_type: string;
//   commission_value: number;
//   referral_enabled: boolean;
//   referral_commission_rate: number;
// }

// interface UserPartnership {
//   id: number;
//   partnership: Partnership;
//   status: "pending" | "accepted" | "declined";
//   total_earned: string;
//   joined_at: string;
// }

// export default function MyPartnerships() {
//   const { access } = useAuth();
//   const [pendingPartnerships, setPendingPartnerships] = useState<UserPartnership[]>([]);
//   const [acceptedPartnerships, setAcceptedPartnerships] = useState<UserPartnership[]>([]);
//   const [loading, setLoading] = useState(true);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "accepted":
//         return "text-green-700";
//       case "pending":
//         return "text-yellow-600";
//       case "declined":
//         return "text-red-600";
//       default:
//         return "text-gray-700";
//     }
//   };

//   useEffect(() => {
//     if (!access) return;

//     const fetchPartnerships = async () => {
//       try {
//         const [{ data: pending }, { data: accepted }] = await Promise.all([
//           axios.get(`${process.env.NEXT_PUBLIC_API_URL}/partner/my/partnerships/?status=pending`, {
//             headers: { Authorization: `Bearer ${access}` },
//           }),
//           axios.get(`${process.env.NEXT_PUBLIC_API_URL}/partner/my/partnerships/?status=accepted`, {
//             headers: { Authorization: `Bearer ${access}` },
//           }),
//         ]);

//         setPendingPartnerships(pending);
//         setAcceptedPartnerships(accepted);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPartnerships();
//   }, [access]);

//   if (loading) return <p>Loading your partnerships...</p>;

//   return (
//     <div className="space-y-8">
//       {/* Pending Applications */}
//       <div>
//         <h2 className="text-xl font-bold mb-4">Pending Applications</h2>
//         {pendingPartnerships.length === 0 ? (
//           <p>No pending applications.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {pendingPartnerships.map((up) => (
//               <Card key={up.id} className="p-4 animate__animated animate__fadeIn">
//                 <h3 className="font-semibold">{up.partnership.title}</h3>
//                 <p className="text-sm text-muted-foreground">{up.partnership.description}</p>
//                 <p className={`space-y-1 text-xs mt-2 ${getStatusColor(up.status)}`}>
//                   <strong>Status:</strong> {up.status} <br />
//                   <strong>Total Earned:</strong> ${up.total_earned} <br />
//                   <strong>Joined At:</strong> {new Date(up.joined_at).toLocaleDateString()}
//                 </p>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Accepted Partnerships */}
//       <div>
//         <h2 className="text-xl font-bold mb-4">Accepted Partnerships</h2>
//         {acceptedPartnerships.length === 0 ? (
//           <p>No accepted partnerships yet.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {acceptedPartnerships.map((up) => (
//               <Card key={up.id} className="p-4 animate__animated animate__fadeIn">
//                 <h3 className="font-semibold">{up.partnership.title}</h3>
//                 <p className="text-sm text-muted-foreground">{up.partnership.description}</p>
//                 <p className={`space-y-1 text-xs mt-2 ${getStatusColor(up.status)}`}>
//                   <strong>Status:</strong> {up.status} <br />
//                   <strong>Total Earned:</strong> ${up.total_earned} <br />
//                   <strong>Joined At:</strong> {new Date(up.joined_at).toLocaleDateString()}
//                 </p>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//           </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert"; 
import { Skeleton } from "@/components/ui/skeleton";  
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface Partnership {
  id: number;
  title: string;
  description: string;
  commission_type: string;
  commission_value: number;
  referral_enabled: boolean;
  referral_commission_rate: number;
}

interface UserPartnership {
  id: number;
  partnership: Partnership;
  status: "pending" | "accepted" | "declined";
  total_earned: string;
  joined_at: string;
}

// Skeleton Loading Component
function PartnershipsSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2].map((section) => (
        <div key={section}>
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((card) => (
              <Card key={card} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-2/5" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Error Alert Component
function ErrorAlert({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertDescription className="flex justify-between items-center">
        <span>{error}</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

// Empty State Component
function EmptyState({ 
  type, 
  onExplore 
}: { 
  type: "pending" | "accepted"; 
  onExplore?: () => void; 
}) {
  const icons = {
    pending: "📝",
    accepted: "🤝"
  };

  const messages = {
    pending: "No pending applications.",
    accepted: "No accepted partnerships yet."
  };

  const descriptions = {
    pending: "You haven't applied to any partnerships yet.",
    accepted: "Start applying to partnerships to see them here."
  };

  return (
    <Card className="text-center py-12 border-2 border-dashed rounded-lg">
      <div className="text-4xl mb-4">{icons[type]}</div>
      <h3 className="text-lg font-semibold mb-2">{messages[type]}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        {descriptions[type]}
      </p>
      {onExplore && (
        <Button onClick={onExplore}>
          Explore Available Partnerships
        </Button>
      )}
    </Card>
  );
}

// Enhanced Partnership Card Component
function PartnershipCard({ 
  userPartnership, 
  onWithdraw 
}: { 
  userPartnership: UserPartnership; 
  onWithdraw?: (id: number) => void;
}) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      case "declined":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatCommission = (partnership: Partnership) => {
    if (partnership.commission_type === 'percentage') {
      return `${partnership.commission_value}% per sale`;
    } else {
      return `$${partnership.commission_value} per sale`;
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
          {userPartnership.partnership.title}
        </h3>
        <Badge variant={getStatusVariant(userPartnership.status)}>
          {userPartnership.status.charAt(0).toUpperCase() + userPartnership.status.slice(1)}
        </Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {userPartnership.partnership.description}
      </p>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Commission:</span>
          <span className="font-semibold">
            {formatCommission(userPartnership.partnership)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Total Earned:</span>
          <span className="font-semibold text-green-600">
            ${parseFloat(userPartnership.total_earned).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Joined:</span>
          <span>{new Date(userPartnership.joined_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}</span>
        </div>

        {userPartnership.partnership.referral_enabled && (
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-600">Referral Rate:</span>
            <span className="text-blue-600 font-semibold">
              {userPartnership.partnership.referral_commission_rate}%
            </span>
          </div>
        )}
      </div>

      {userPartnership.status === "pending" && onWithdraw && (
        <div className="mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onWithdraw(userPartnership.id)}
            className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            Withdraw Application
          </Button>
        </div>
      )}

      {userPartnership.status === "accepted" && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            <Button size="sm" className="flex-1">
              Get Links
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// Stats Overview Component
function StatsOverview({ 
  pendingCount, 
  acceptedCount, 
  totalEarned 
}: { 
  pendingCount: number; 
  acceptedCount: number; 
  totalEarned: number;
}) {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Partnership Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
          <div className="text-sm text-blue-600 font-medium">Pending Applications</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{acceptedCount}</div>
          <div className="text-sm text-green-600 font-medium">Active Partnerships</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">${totalEarned.toFixed(2)}</div>
          <div className="text-sm text-purple-600 font-medium">Total Earned</div>
        </div>
      </div>
    </Card>
  );
}

// Main Component
export default function MyPartnerships() {
  const { access } = useAuth();
  const [pendingPartnerships, setPendingPartnerships] = useState<UserPartnership[]>([]);
  const [acceptedPartnerships, setAcceptedPartnerships] = useState<UserPartnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartnerships = async () => {
    if (!access) return;

    try {
      setError(null);
      setLoading(true);
      
      const [pendingResponse, acceptedResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/partner/my/partnerships/?status=pending`, {
          headers: { Authorization: `Bearer ${access}` },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/partner/my/partnerships/?status=accepted`, {
          headers: { Authorization: `Bearer ${access}` },
        }),
      ]);

      setPendingPartnerships(pendingResponse.data);
      setAcceptedPartnerships(acceptedResponse.data);
    } catch (err: any) {
      console.error("Failed to fetch partnerships:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.detail || 
        "Failed to load partnerships. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (partnershipId: number) => {
    if (!window.confirm("Are you sure you want to withdraw this application? This action cannot be undone.")) {
      return;
    }
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/partner/my/partnerships/${partnershipId}/`,
        { headers: { Authorization: `Bearer ${access}` } }
      );
      
      // Remove from pending partnerships
      setPendingPartnerships(prev => 
        prev.filter(up => up.id !== partnershipId)
      );
    } catch (err: any) {
      console.error("Failed to withdraw application:", err);
      alert("Failed to withdraw application. Please try again.");
    }
  };

  const handleExplorePartnerships = () => {
    // Navigate to available partnerships page
    window.location.href = '/partnerships/available';
  };

  const handleRefresh = () => {
    fetchPartnerships();
  };

  useEffect(() => {
    fetchPartnerships();
  }, [access]);

  // Calculate total earned from accepted partnerships
  const totalEarned = acceptedPartnerships.reduce((total, up) => {
    return total + parseFloat(up.total_earned);
  }, 0);

  if (loading) return <PartnershipsSkeleton />;
  
  if (error) return <ErrorAlert error={error} onRetry={fetchPartnerships} />;

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Partnerships</h1>
          <p className="text-muted-foreground mt-2">
            Manage your partnership applications and track your earnings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
          <Button onClick={handleExplorePartnerships}>
            Find New Partnerships
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview 
        pendingCount={pendingPartnerships.length}
        acceptedCount={acceptedPartnerships.length}
        totalEarned={totalEarned}
      />

      {/* Pending Applications Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Pending Applications</h2>
            <p className="text-muted-foreground mt-1">
              Partnerships you've applied to that are under review
            </p>
          </div>
          <Badge variant="warning" className="text-sm px-3 py-1">
            {pendingPartnerships.length} application{pendingPartnerships.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        {pendingPartnerships.length === 0 ? (
          <EmptyState 
            type="pending" 
            onExplore={handleExplorePartnerships}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPartnerships.map((up) => (
              <PartnershipCard 
                key={up.id} 
                userPartnership={up} 
                onWithdraw={handleWithdraw}
              />
            ))}
          </div>
        )}
      </section>

      {/* Accepted Partnerships Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Active Partnerships</h2>
            <p className="text-muted-foreground mt-1">
              Partnerships that have been accepted and are active
            </p>
          </div>
          <Badge variant="success" className="text-sm px-3 py-1">
            {acceptedPartnerships.length} active
          </Badge>
        </div>
        
        {acceptedPartnerships.length === 0 ? (
          <EmptyState type="accepted" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedPartnerships.map((up) => (
              <PartnershipCard key={up.id} userPartnership={up} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}