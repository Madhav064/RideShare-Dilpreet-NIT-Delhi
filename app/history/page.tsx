"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useRideHistory } from "@/hooks/useRideHistory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  User, 
  Star, 
  Map as MapIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MapThumbnail } from "@/components/MapThumbnail";

export default function RideHistoryPage() {
  const { rides } = useRideHistory();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          badge: "bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
          border: "",
          opacity: ""
        };
      case "upcoming":
        return {
          badge: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
          border: "border-l-4 border-l-blue-500",
          opacity: ""
        };
      case "cancelled":
        return {
          badge: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
          border: "",
          opacity: "opacity-75"
        };
      default:
        return {
          badge: "variant-outline",
          border: "",
          opacity: ""
        };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Trips</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        {rides.length === 0 ? (
           <div className="text-center py-12 border rounded-xl bg-card shadow-sm">
             <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Calendar className="h-8 w-8 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-semibold mb-2">No rides yet</h3>
             <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
               Your ride history will appear here once you've completed your first trip.
             </p>
             <Button asChild>
               <Link href="/book">Book Your First Ride</Link>
             </Button>
           </div>
        ) : (
          rides.map((ride) => {
            const styles = getStatusConfig(ride.status);
            
            return (
              <div 
                key={ride.id}
                className={cn(
                  "bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-4 items-center group cursor-pointer relative overflow-hidden",
                  styles.border,
                  styles.opacity
                )}
              >
                {/* Left (Thumbnail) */}
                <div className="w-full md:w-20 hidden md:block">
                  <MapThumbnail location={ride.dropoff} />
                </div>

                {/* Middle (Details) */}
                <div className="flex-1 w-full min-w-0 flex flex-col gap-3">
                   {/* Row 1: Date + Status */}
                   <div className="flex items-center justify-between md:justify-start gap-3">
                      <span className="font-semibold text-sm">
                        {format(new Date(ride.date), "MMM d, h:mm a")}
                      </span>
                      <Badge variant="outline" className={cn("rounded-md px-2 py-0.5 border-0 font-medium", styles.badge)}>
                         {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                      </Badge>
                   </div>

                   {/* Row 2: Addresses */}
                   <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <div className="w-2 h-2 rounded-full bg-muted-foreground/30 flex-shrink-0" />
                         <span className="truncate">{ride.pickup}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                         <div className="w-2 h-2 rounded-sm bg-foreground flex-shrink-0" />
                         <span className="truncate">{ride.dropoff}</span>
                      </div>
                   </div>
                </div>

                {/* Right (Driver) - Hide for scheduled/cancelled if no driver */}
                 {ride.driver && (
                  <div className="w-full md:w-48 lg:w-60 flex md:flex-col lg:flex-row items-center justify-center lg:justify-start gap-3 md:pl-4 md:border-l border-border shrink-0">
                     <div className="w-10 h-10 rounded-full bg-muted flex flex-shrink-0 items-center justify-center">
                       <User className="h-5 w-5 text-muted-foreground" />
                     </div>
                     <div className="flex flex-col items-center lg:items-start text-center lg:text-left overflow-hidden w-full">
                        <span className="text-sm font-medium truncate w-full">{ride.driver.name}</span>
                        <span className="text-xs text-muted-foreground flex items-center justify-center lg:justify-start gap-1 w-full">
                          <span className="truncate max-w-[80px]">{ride.driver.vehicle}</span> 
                          {ride.driver.rating && (
                            <span className="flex-shrink-0 whitespace-nowrap">
                              • <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline mb-0.5" />
                              {ride.driver.rating}
                            </span>
                          )}
                        </span>
                     </div>
                  </div>
                 )}

                {/* Far Right (Price) */}
                <div className="w-full md:w-10 flex items-center justify-end gap-4 md:pl-4 shrink-0">
                   <div className="flex flex-col items-end">
                      <span className="text-lg font-bold">${ride.fare.toFixed(2)}</span>
                   </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
