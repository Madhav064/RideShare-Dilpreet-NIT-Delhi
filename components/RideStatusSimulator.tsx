"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRideHistory } from "@/hooks/useRideHistory";

export function RideStatusSimulator() {
  const { rides, updateRideStatus, updateRideStatusMessage } = useRideHistory();
  const lastProcessedId = useRef<string | null>(null);

  // We only depend on the ID changing to start a new simulation.
  // We capture the ride details in the closure when it starts.
  const latestRideId = rides[0]?.id;
  
  useEffect(() => {
    // Grab the current latest ride from the list
    const latestRide = rides.find(r => r.id === latestRideId);
    
    // Only trigger if we have a new upcoming ride that we haven't simulated yet
    if (
      latestRide && 
      latestRide.status === 'upcoming' && 
      latestRide.id !== lastProcessedId.current &&
      // Check if the ride was created recently (e.g., within last minute) to avoid re-triggering old rides on refresh
      (new Date().getTime() - new Date(latestRide.date).getTime() < 60000)
    ) {
      lastProcessedId.current = latestRide.id;

      // Initial status
      updateRideStatusMessage(latestRide.id, "Looking for nearby drivers...");

      const t1 = setTimeout(() => {
        // We use the ID directly, assuming the ride object might be stale but ID is constant
        const msg = `Driver ${latestRide.driver.name} has accepted your ride.`;
        toast.info(msg);
        updateRideStatusMessage(latestRide.id, "Driver accepted your ride");
      }, 5000);

      const t2 = setTimeout(() => {
        toast.info("Driver is arriving in 2 minutes.");
        updateRideStatusMessage(latestRide.id, "Arriving in 2 minutes");
      }, 10000);

      const t3 = setTimeout(() => {
        toast.success("Driver has arrived!");
        updateRideStatusMessage(latestRide.id, "Driver has arrived");
      }, 20000);

      const t4 = setTimeout(() => {
        toast.success("Ride Completed!");
        updateRideStatusMessage(latestRide.id, "Ride Completed");
        updateRideStatus(latestRide.id, 'completed');
      }, 30000);

      // Cleanup timeouts if the component unmounts
      // NOTE: We do NOT depend on 'rides' here to avoid clearing timeouts when the status updates
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [latestRideId, updateRideStatus, updateRideStatusMessage]); // Only re-run if the Ride ID changes

  return null;
}
