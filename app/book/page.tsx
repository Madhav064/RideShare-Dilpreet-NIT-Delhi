"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookingForm } from "@/components/BookingForm";
import StripeCheckout from "@/components/StripeCheckout";
import { useRideHistory } from "@/hooks/useRideHistory";

// Dynamically import LocationSearch to disable SSR (leaflet-geosearch requires window)
const LocationSearch = dynamic(() => import("@/components/LocationSearch").then(mod => mod.LocationSearch), {
  ssr: false,
  loading: () => <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
});

// Dynamically import Map to disable SSR
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center rounded-md">Loading Map...</div>,
});

interface Location {
  lat: number;
  lng: number;
}

export default function BookRidePage() {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'booked'>('idle');
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedRide, setSelectedRide] = useState<{ type: string; price: number; isShared?: boolean } | null>(null);
  const { addRide } = useRideHistory();
  const router = useRouter();

  // Reset if pickup/dropoff changes to null (handled by Map component mainly)
  // But also good to reset if either is removed
  useEffect(() => {
    if (!pickup || !dropoff) {
      setDistance(0);
      setDuration(0);
      setSelectedRide(null);
    }
  }, [pickup, dropoff]);

  const handleRouteFound = (distanceMeters: number, durationSeconds: number) => {
    const distKm = parseFloat((distanceMeters / 1000).toFixed(1));
    const durationMin = Math.round(durationSeconds / 60);
    
    setDistance(distKm);
    setDuration(durationMin);
  };

  const handleRideSelect = (rideType: string, price: number, isShared: boolean) => {
    setSelectedRide({ type: rideType, price, isShared });
  };

  const handlePaymentSuccess = () => {
    if (!selectedRide) return;
    
    setBookingStatus('booking');

    // Simulate Rider Assignment
    const drivers = ['Rajesh', 'Suresh', 'Vikram'];
    const vehicles = ['Toyota Etios', 'Swift Dzire', 'Hyundai Aura'];
    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

    addRide({
      pickup: pickupAddress || "Selected Pickup Location",
      dropoff: dropoffAddress || "Selected Destination", 
      fare: selectedRide.price,
      status: 'upcoming',
      driver: {
        name: randomDriver,
        rating: 4.8,
        vehicle: randomVehicle
      },
      type: selectedRide.type + (selectedRide.isShared ? ' (Shared)' : ''),
      distance: distance.toFixed(1)
    });

    setBookingStatus('booked');
    
    // Redirect
    setTimeout(() => {
      router.push('/history');
    }, 2000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Background Map - Absolute Inset 0 */}
      <div className="absolute inset-0 z-0">
        <Map 
          pickup={pickup} 
          dropoff={dropoff} 
          setPickup={setPickup} 
          setDropoff={setDropoff}
          onRouteFound={handleRouteFound}
        />
      </div>

      {/* Floating Panel - Top Left */}
      <div className="absolute top-4 left-4 z-10 w-full max-w-md max-h-[90vh] overflow-y-auto pr-2">
        <div className="bg-card text-card-foreground shadow-2xl rounded-2xl p-4 border border-border/50 backdrop-blur-sm bg-white/95 dark:bg-zinc-950/95">
          <h1 className="text-xl font-bold mb-4">Book a Ride</h1>
          
          {!selectedRide ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <LocationSearch
                  placeholder="Where from?"
                  onSelect={(loc) => {
                    setPickup({ lat: loc.lat, lng: loc.lng });
                    setPickupAddress(loc.address);
                  }}
                />
                <LocationSearch
                  placeholder="Where to?"
                  onSelect={(loc) => {
                    setDropoff({ lat: loc.lat, lng: loc.lng });
                    setDropoffAddress(loc.address);
                  }}
                />
              </div>
              <BookingForm 
                distance={distance} 
                duration={duration}
                onRideSelect={handleRideSelect} 
                bookingStatus={bookingStatus}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Complete Payment</h2>
                <button 
                  onClick={() => setSelectedRide(null)}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Back to options
                </button>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg space-y-3 text-sm border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ride Type</span>
                  <span className="font-medium capitalize">{selectedRide.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Distance</span>
                  <span className="font-medium">{distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Time</span>
                  <span className="font-medium">{duration} min</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between items-center">
                  <span className="font-semibold text-base">Total</span>
                  <span className="font-bold text-lg text-primary">${selectedRide.price.toFixed(2)}</span>
                </div>
              </div>
              
              <StripeCheckout 
                amount={selectedRide.price} 
                onSuccess={handlePaymentSuccess} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
