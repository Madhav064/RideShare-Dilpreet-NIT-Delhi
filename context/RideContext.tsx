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
