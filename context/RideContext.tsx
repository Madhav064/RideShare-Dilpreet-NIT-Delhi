"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export type RideStatus = 'completed' | 'upcoming' | 'cancelled' | 'finding' | 'arriving' | 'arrived' | 'in-progress';

export interface Ride {
  id: string;
  date: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: RideStatus;
  statusMessage?: string; // e.g. "Arriving in 2 mins"
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
  updateRideStatus: (id: string, status: RideStatus) => void;
  updateRideStatusMessage: (id: string, message: string) => void;
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

  const addRide = useCallback((rideData: Omit<Ride, "id" | "date">) => {
    const newRide: Ride = {
      id: crypto.randomUUID(), // Modern random ID
      date: new Date().toISOString(),
      statusMessage: "Detailed searching...",
      ...rideData,
    };

    setRides(currentRides => {
        const updated = [newRide, ...currentRides];
        localStorage.setItem("ride_history", JSON.stringify(updated));
        return updated;
    });
  }, []);

  const updateRideStatus = useCallback((id: string, status: RideStatus) => {
    setRides(currentRides => {
      const updatedRides = currentRides.map(ride => 
        ride.id === id ? { ...ride, status } : ride
      );
      localStorage.setItem("ride_history", JSON.stringify(updatedRides));
      return updatedRides;
    });
  }, []);

  const updateRideStatusMessage = useCallback((id: string, message: string) => {
    setRides(currentRides => {
      const updatedRides = currentRides.map(ride => 
        ride.id === id ? { ...ride, statusMessage: message } : ride
      );
      // We generally want to persist the message too if the users reload
      localStorage.setItem("ride_history", JSON.stringify(updatedRides));
      return updatedRides;
    });
  }, []);

  return (
    <RideContext.Provider value={{ rides, addRide, updateRideStatus, updateRideStatusMessage }}>
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
