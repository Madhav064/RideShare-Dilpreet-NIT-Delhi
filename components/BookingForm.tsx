"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Zap } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
    multiplier: 1,
    image: "/images/uberx.png",
    capacity: 4,
  },
  {
    id: "suv",
    title: "SUV",
    multiplier: 1.2,
    image: "/images/xl.png",
    capacity: 6,
  },
  {
    id: "premium",
    title: "Premium",
    multiplier: 1.5,
    image: "/images/black.png",
    capacity: 4,
  },
];

export function BookingForm({ onRideSelect, bookingStatus, distance, duration }: BookingFormProps) {
  const [selectedRide, setSelectedRide] = useState(RIDE_OPTIONS[0]);
  const [isShared, setIsShared] = useState(false);

  const calculatePrice = (multiplier: number) => {
    if (distance <= 0) return 0;
    const basePrice = 10; // Base fare
    const perKm = 1.5; // Cost per km
    let price = (basePrice + distance * perKm) * multiplier;
    
    if (isShared) {
      price = price * 0.75; // 25% discount
    }

    return parseFloat(price.toFixed(2));
  };

  const getArrivalTime = () => {
    const now = new Date();
    if (!duration) return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const arrival = new Date(now.getTime() + duration * 60000);
    return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg">
      
      {/* Header Info */}
      <div className="pb-3 text-center border-b border-gray-100 dark:border-zinc-800 mb-2">
        <p className="text-xs font-medium text-muted-foreground">
          {distance > 0 ? (
            <span>
              Distance: <span className="font-bold text-foreground">{distance.toFixed(1)} km</span> • 
              Est. Time: <span className="font-bold text-foreground">{duration} min</span>
            </span>
          ) : (
            "Select destination to view prices"
          )}
        </p>
      </div>

      {/* Ride List */}
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[300px] pr-1">
        {RIDE_OPTIONS.map((ride) => {
          const price = calculatePrice(ride.multiplier);
          const isSelected = selectedRide.id === ride.id;

          return (
            <div
              key={ride.id}
              onClick={() => distance > 0 && setSelectedRide(ride)}
              className={cn(
                "flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all",
                isSelected
                  ? "border-black bg-gray-50 dark:border-white dark:bg-zinc-800"
                  : "border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800",
                distance === 0 && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              {/* Image */}
              <div className="relative w-16 h-16 mr-4 flex-shrink-0">
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
                  <h3 className="font-bold text-lg leading-none">{ride.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground bg-gray-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded-full">
                    <User className="w-3 h-3 mr-0.5" />
                    {ride.capacity}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {distance > 0 ? getArrivalTime() : "--:--"} dropoff
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                    Fastest
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="font-bold text-lg">
                  ${distance > 0 ? price : "0.00"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ride Share Toggle */}
      <div className="px-1 py-4">
        <div className="flex items-center justify-between p-3 border rounded-xl bg-gray-50 dark:bg-zinc-800/50">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Label htmlFor="ride-share" className="font-semibold cursor-pointer">
                Ride Share (Split Fare)
              </Label>
              {isShared && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-[10px] px-1.5 h-5">
                  -25% Applied
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              Share your ride with another passenger and save.
            </p>
          </div>
          <Switch
            id="ride-share"
            checked={isShared}
            onCheckedChange={setIsShared}
            disabled={distance === 0}
          />
        </div>
      </div>

      {/* Footer Button */}
      <div className="pt-2 mt-2 border-t border-gray-100 dark:border-zinc-800 sticky bottom-0 bg-white dark:bg-zinc-900 z-10">
        <Button
          className="w-full h-12 text-lg font-bold shadow-md rounded-xl"
          disabled={distance === 0 || bookingStatus === 'booking'}
          onClick={() => onRideSelect(selectedRide.id, calculatePrice(selectedRide.multiplier), isShared)}
        >
          {bookingStatus === 'booking' ? "Requesting..." : `Request ${selectedRide.title}`}
        </Button>
      </div>
    </div>
  );
}
