"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRideHistory } from "@/hooks/useRideHistory";

export function RideStatusSimulator() {
  const { rides } = useRideHistory();
  const lastProcessedId = useRef<string | null>(null);

  useEffect(() => {
    const latestRide = rides[0];

    // Only trigger if we have a new upcoming ride that we haven't simulated yet
    if (
      latestRide && 
      latestRide.status === 'upcoming' && 
      latestRide.id !== lastProcessedId.current &&
      // Check if the ride was created recently (e.g., within last minute) to avoid re-triggering old rides on refresh
      (new Date().getTime() - new Date(latestRide.date).getTime() < 60000)
    ) {
      lastProcessedId.current = latestRide.id;

      const t1 = setTimeout(() => {
        toast.info(`Driver ${latestRide.driver.name} has accepted your ride.`);
      }, 5000);

      const t2 = setTimeout(() => {
        toast.info("Driver is arriving in 2 minutes.");
      }, 15000);

      const t3 = setTimeout(() => {
        toast.success("Driver has arrived!");
      }, 30000);

      // Cleanup timeouts if the component unmounts or if a new ride is booked
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [rides]);

  return null;
}
