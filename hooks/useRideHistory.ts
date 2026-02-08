"use client";

import { useRideContext } from "@/context/RideContext";
import type { Ride } from "@/context/RideContext";

export type { Ride };

export const useRideHistory = () => {
  return useRideContext();
};

