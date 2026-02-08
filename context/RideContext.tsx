"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Ride {
  id: string;
  date: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: 'completed' | 'upcoming' | 'cancelled';
  driver: {
    name: string;
    rating: number;
    vehicle: string;
  };
  type?: string;
  distance?: string;
}

interface RideContextType {
  rides: Ride[];
  addRide: (rideData: Omit<Ride, "id" | "date">) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider = ({ children }: { children: ReactNode }) => {
  const [rides, setRides] = useState<Ride[]>([]);

  // Load rides from localStorage on mount
  useEffect(() => {
    const storedRides = localStorage.getItem("ride_history");
    if (storedRides) {
      try {
        setRides(JSON.parse(storedRides));
      } catch (error) {
        console.error("Failed to parse ride history:", error);
      }
    }
  }, []);

  // Auto-complete rides after 30 minutes
  useEffect(() => {
    const checkRideStatus = () => {
      setRides(currentRides => {
        const now = new Date();
        let hasChanges = false;
        
        const updatedRides = currentRides.map(ride => {
          if (ride.status === 'upcoming') {
            const rideDate = new Date(ride.date);
            const diffInMinutes = (now.getTime() - rideDate.getTime()) / (1000 * 60);
            
            // If ride is older than 30 minutes, mark as completed
            if (diffInMinutes >= 30) {
               hasChanges = true;
               return { ...ride, status: 'completed' as const };
            }
          }
          return ride;
        });

        if (hasChanges) {
          localStorage.setItem("ride_history", JSON.stringify(updatedRides));
          return updatedRides;
        }
        return currentRides;
      });
    };

    // Check immediately and then every minute
    const interval = setInterval(checkRideStatus, 60000);
    // Run once on mount (with a small delay to ensure initial load is done if we want, 
    // but the interval covers it shortly, or we can just run it).
    // Actually, running it immediately might conflict with initial load if not careful.
    // The safest way is to let the interval handle it, or use a separate effect that depends on nothing but sets interval.
    
    checkRideStatus(); // Initial check

    return () => clearInterval(interval);
  }, []); // Run effect once on mount, inside we use functional state update to access latest rides

  const addRide = (rideData: Omit<Ride, "id" | "date">) => {
    const newRide: Ride = {
      id: crypto.randomUUID(), // Modern random ID
      date: new Date().toISOString(),
      ...rideData,
    };

    const updatedRides = [newRide, ...rides];
    setRides(updatedRides);
    localStorage.setItem("ride_history", JSON.stringify(updatedRides));
  };

  return (
    <RideContext.Provider value={{ rides, addRide }}>
      {children}
    </RideContext.Provider>
  );
};

export const useRideContext = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error("useRideContext must be used within a RideProvider");
  }
  return context;
};
