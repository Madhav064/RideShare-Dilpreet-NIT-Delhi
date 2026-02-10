"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, MapPin, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveRidePanelProps {
  driver: {
    name: string;
    vehicle: string;
    rating: number;
    plate?: string;
    image?: string;
  };
  pickup: string;
  dropoff: string;
  status: string; // "Driver accepted", "Arriving in 2 mins", etc.
}

export function ActiveRidePanel({ driver, pickup, dropoff, status }: ActiveRidePanelProps) {
  
  // Parse vehicle info if it looks like "Toyota Etios" to split/format
  const vehicleDisplay = driver.vehicle;
  const plateDisplay = driver.plate || "CAB-1234";

  // Dynamic Title Logic
  const getTitle = (s: string) => {
    const lower = s.toLowerCase();
    if (lower.includes("looking") || lower.includes("searching")) return "Finding your ride";
    if (lower.includes("accepted")) return "Ride Confirmed";
    if (lower.includes("arriving") || lower.includes("way")) return "Driver is on the way";
    if (lower.includes("arrived") || lower.includes("here")) return "Driver is here";
    if (lower.includes("completed")) return "You have arrived";
    return "Current Ride";
  };

  const title = getTitle(status);
  const isSearching = title === "Finding your ride";

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-2xl shadow-xl p-5 border border-zinc-100 dark:border-zinc-800 animate-in slide-in-from-bottom-5 duration-500">
      
      {/* Header with Live Status Indicator */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1 animate-pulse">
            {status}
          </p>
        </div>
        <div className="relative">
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isSearching ? "bg-amber-400 animate-ping" : "bg-green-400 animate-ping"}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isSearching ? "bg-amber-500" : "bg-green-500"}`}></span>
          </span>
        </div>
      </div>

      {/* Driver Info Row */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800 h-[88px]">
         {isSearching ? (
             <div className="flex items-center gap-4 w-full">
                <div className="h-14 w-14 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                    <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
                </div>
                <div className="flex-1 space-y-2">
                    <div className="h-5 bg-zinc-100 dark:bg-zinc-900 rounded w-32 animate-pulse" />
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-900 rounded w-24 animate-pulse relative overflow-hidden" />
                </div>
             </div>
         ) : (
            <>
              {/* Avatar */}
              <Avatar className="h-14 w-14 border-2 border-white shadow-sm shrink-0">
                  <AvatarImage src={driver.image} />
                  <AvatarFallback className="bg-zinc-100 text-zinc-600 font-bold text-lg dark:bg-zinc-800 dark:text-zinc-300">
                    {driver.name.charAt(0)}
                  </AvatarFallback>
              </Avatar>

              {/* Details */}
              <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-900 dark:text-white text-lg line-clamp-1">{driver.name}</h3>
                    <span className="text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                        ★ {driver.rating}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{vehicleDisplay}</span>
                    <span className="mx-1.5">•</span>
                    <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 rounded text-xs tracking-wide border border-zinc-200 dark:border-zinc-700">{plateDisplay}</span>
                  </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                  <Button size="icon" variant="outline" className="rounded-full h-10 w-10 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <MessageSquare className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                  </Button>
                  <Button size="icon" className="rounded-full h-10 w-10 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                    <Phone className="h-4 w-4" />
                  </Button>
              </div>
            </>
         )}
      </div>

      {/* Visual Timeline (Mini Route Preview) */}
      <div className="relative pl-2">
         {/* Connecting Line */}
         <div className="absolute left-[15px] top-2 bottom-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />

         {/* Pickup */}
         <div className="flex gap-3 mb-4 relative z-10">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-zinc-400 bg-white dark:bg-zinc-950 mt-1.5 shrink-0" />
            <div className="flex-1">
               <p className="text-xs text-zinc-400 uppercase font-semibold tracking-wider mb-0.5">Pickup</p>
               <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{pickup}</p>
            </div>
         </div>

         {/* Dropoff */}
         <div className="flex gap-3 relative z-10">
            <MapPin className="w-3 h-3 text-black dark:text-white mt-1 shrink-0 ml-[1px]" fill="currentColor" />
            <div className="flex-1">
               <p className="text-xs text-zinc-400 uppercase font-semibold tracking-wider mb-0.5">Dropoff</p>
               <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{dropoff}</p>
            </div>
         </div>
      </div>

    </div>
  );
}
