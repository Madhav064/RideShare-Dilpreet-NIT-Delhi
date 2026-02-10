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

      // Status sequence execution
      
      // 1. Finding (Immediate)
      updateRideStatus(latestRide.id, 'finding');
      updateRideStatusMessage(latestRide.id, "Looking for nearby drivers...");

      // 2. Accepted (After 5 sec)
      const t1 = setTimeout(() => {
        const msg = `Driver ${latestRide.driver.name} has accepted your ride.`;
        toast.info(msg);
        updateRideStatus(latestRide.id, 'arriving');
        updateRideStatusMessage(latestRide.id, "Driver accepted your ride");
      }, 5000);

      // 3. Arriving (After 1 minute - User requirement)
      // "from driver accepting to driver arriving a minute" -> 5s + 60s = 65s
      const t2 = setTimeout(() => {
        toast.info("Driver is arriving soon.");
        updateRideStatusMessage(latestRide.id, "Arriving in 1 minute");
      }, 65000);

      // 4. Arrived (After 1m 30s)
      const t3 = setTimeout(() => {
        toast.success("Driver has arrived!");
        updateRideStatus(latestRide.id, 'arrived');
        updateRideStatusMessage(latestRide.id, "Driver has arrived");
      }, 90000);

      // 5. In Progress & Completed
      const t4 = setTimeout(() => {
         updateRideStatus(latestRide.id, 'in-progress');
         updateRideStatusMessage(latestRide.id, "Heading to destination...");
      }, 100000);

      const t5 = setTimeout(() => {
        toast.success("Ride Completed!");
        updateRideStatusMessage(latestRide.id, "Ride Completed");
        updateRideStatus(latestRide.id, 'completed');
      }, 110000);

      // Cleanup
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        lastProcessedId.current = null;
      };
    }
  }, [latestRideId, updateRideStatus, updateRideStatusMessage]); // Only re-run if the Ride ID changes

  return null;
}
