"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Zap } from "lucide-react";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";

interface BookingFormProps {
  onRideSelect: (rideType: string, price: number, isShared: boolean) => void;
  bookingStatus: 'idle' | 'booking' | 'booked';
  distance: number; // in km
  duration?: number; // in minutes
}

const RIDE_OPTIONS = [
  {
    id: "economy",
    title: "Economy",
    basePrice: 50,
    perKm: 12,
    image: "/images/uberx.png",
    capacity: 4,
  },
  {
    id: "comfort", // changed from suv to match instructions better, or keep ID but update details
    title: "Comfort",
    basePrice: 80,
    perKm: 18,
    image: "/images/xl.png",
    capacity: 6,
  },
  {
    id: "luxury", // changed from premium
    title: "Luxury",
    basePrice: 150,
    perKm: 25,
    image: "/images/black.png",
    capacity: 4,
  },
];

export function BookingForm({ onRideSelect, bookingStatus, distance, duration }: BookingFormProps) {
  const [selectedRide, setSelectedRide] = useState(RIDE_OPTIONS[0]);
  const [isShared, setIsShared] = useState(false);

  // Updated Calculate Price logic
  const calculatePrice = (option: typeof RIDE_OPTIONS[0]) => {
    if (distance <= 0) return 0;
    
    // Logic: Base Price + (Distance * Per Km) + (Time * Per Minute)
    // Per Minute: ₹2/min
    
    let price = option.basePrice + (distance * option.perKm) + ((duration || 0) * 2);
    
    if (isShared) {
      price = price * 0.75; // 25% discount for shared rides
    }

    return Math.round(price); // Round to nearest integer for cleaner INR display
  };

  const getArrivalTime = () => {
    const now = new Date();
    if (!duration) return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const arrival = new Date(now.getTime() + duration * 60000);
    return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 rounded-lg">
      
      {/* Ride List */}
      <div className="flex-1 overflow-y-auto space-y-1 max-h-[300px] px-2 pt-2">
        {RIDE_OPTIONS.map((ride) => {
          const price = calculatePrice(ride);
          const isSelected = selectedRide.id === ride.id;

          return (
            <div
              key={ride.id}
              onClick={() => distance > 0 && setSelectedRide(ride)}
              className={cn(
                "flex items-center p-3 rounded-xl cursor-pointer transition-all border border-transparent",
                isSelected
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-lg"
                  : "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 border-transparent",
                distance === 0 && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              {/* Image */}
              <div className="relative w-14 h-14 mr-4 flex-shrink-0">
                <Image
                  src={ride.image}
                  alt={ride.title}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={cn("font-bold text-lg leading-none", isSelected ? "text-white dark:text-zinc-900" : "text-zinc-900 dark:text-zinc-100")}>{ride.title}</h3>
                  <div className={cn("flex items-center text-xs px-1.5 py-0.5 rounded-full font-medium", isSelected ? "bg-zinc-800 text-zinc-300 dark:bg-zinc-200 dark:text-zinc-700" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400")}>
                    <User className="w-3 h-3 mr-0.5" />
                    {ride.capacity}
                  </div>
                </div>
                <p className={cn("text-xs mt-1", isSelected ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-500 dark:text-zinc-400")}>
                  {distance > 0 ? getArrivalTime() : "--:--"} dropoff
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className={cn("font-bold text-lg", isSelected ? "text-white dark:text-zinc-900" : "text-zinc-900 dark:text-white")}>
                  {distance > 0 ? formatCurrency(price) : formatCurrency(0)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ride Share Toggle & Footer */}
      <div className="p-4 bg-white dark:bg-zinc-950 sticky bottom-0 z-10 border-t border-zinc-100 dark:border-zinc-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        
        {/* Simplified Ride Share */}
        <div className="flex items-center justify-between mb-3 px-1">
             <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                <Zap className={cn("w-4 h-4 fill-yellow-500 text-yellow-500", !isShared && "grayscale opacity-50")} />
                <span>Split Fare (Save 25%)</span>
             </div>
             <Switch
                id="ride-share"
                checked={isShared}
                onCheckedChange={setIsShared}
                disabled={distance === 0}
                className="scale-90"
              />
        </div>

        <Button
          className="w-full h-12 text-lg font-bold shadow-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 rounded-xl"
          disabled={distance === 0 || bookingStatus === 'booking'}
          onClick={() => onRideSelect(selectedRide.id, calculatePrice(selectedRide), isShared)}
        >
          {bookingStatus === 'booking' ? "Requesting..." : `Confirm ${selectedRide.title}`}
        </Button>
      </div>
    </div>
  );
}
