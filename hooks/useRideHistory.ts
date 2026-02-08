"use client";

import { useState, useEffect } from "react";

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
  type?: string; // Optional to support existing booking logic if needed
  distance?: string; // Optional to support existing booking logic if needed
}

export const useRideHistory = () => {
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

  return { rides, addRide };
};
