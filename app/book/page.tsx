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

// Helper: Haversine Formula for distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

interface Location {
  lat: number;
  lng: number;
}

export default function BookRidePage() {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [dropoff, setDropoff] = useState<Location | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'booked'>('idle');
  const router = useRouter();

  // Calculate distance whenever points change
  const distance = useMemo(() => {
    if (pickup && dropoff) {
      return getDistanceFromLatLonInKm(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);
    }
    return 0;
  }, [pickup, dropoff]);

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
          />
        </div>
      </div>
    </div>
  );
}
