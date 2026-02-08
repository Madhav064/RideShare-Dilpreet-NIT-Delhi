"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookingForm } from "@/components/BookingForm";

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
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'booked'>('idle');
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const router = useRouter();

  // Reset if pickup/dropoff changes to null (handled by Map component mainly)
  // But also good to reset if either is removed
  useEffect(() => {
    if (!pickup || !dropoff) {
      setDistance(0);
      setDuration(0);
    }
  }, [pickup, dropoff]);

  const handleRouteFound = (distanceMeters: number, durationSeconds: number) => {
    const distKm = parseFloat((distanceMeters / 1000).toFixed(1));
    const durationMin = Math.round(durationSeconds / 60);
    
    setDistance(distKm);
    setDuration(durationMin);
  };

  const handleRideSelect = (rideType: string, price: number) => {
    setBookingStatus('booking');

    // Simulate API call
    setTimeout(() => {
	    // Create Ride Object
      const newRide = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        pickup: "Selected Location", // In a real app we'd reverse geocode coordinates
        dropoff: "Destination",
        fare: price,
        status: "Completed", // Simplified for demo
        type: rideType,
        distance: distance.toFixed(1)
      };

      // Save to History (Mock DB)
      const currentHistory = JSON.parse(localStorage.getItem('ride_history') || '[]');
      localStorage.setItem('ride_history', JSON.stringify([newRide, ...currentHistory]));

      setBookingStatus('booked');
      toast.success('Ride Booked! Driver is on the way.');
      
      // Redirect
      setTimeout(() => {
        router.push('/history');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold mb-6">Book a Ride</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-4rem)]">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 h-fit">
          <BookingForm 
            distance={distance} 
            duration={duration}
            onRideSelect={handleRideSelect} 
            bookingStatus={bookingStatus}
          />
          <div className="mt-4 text-sm text-muted-foreground bg-muted/50 p-4 rounded-md">
            <p className="font-semibold mb-1">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
                <li>Click on the map to set <strong>Pickup</strong>.</li>
                <li>Click again to set <strong>Dropoff</strong>.</li>
                <li>Select your ride options and book!</li>
            </ol>
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-2 h-[400px] lg:h-full border rounded-md shadow-sm overflow-hidden relative">
          <Map 
            pickup={pickup} 
            dropoff={dropoff} 
            setPickup={setPickup} 
            setDropoff={setDropoff}
            onRouteFound={handleRouteFound}
          />
        </div>
      </div>
    </div>
  );
}
