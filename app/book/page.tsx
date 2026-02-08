"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookingForm } from "@/components/BookingForm";
import StripeCheckout from "@/components/StripeCheckout";
import { useRideHistory } from "@/hooks/useRideHistory";

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
  const [selectedRide, setSelectedRide] = useState<{ type: string; price: number } | null>(null);
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

  const handleRideSelect = (rideType: string, price: number) => {
    setSelectedRide({ type: rideType, price });
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
      pickup: "Selected Pickup Location", // In real app: reverse geocode coordinates
      dropoff: "Selected Destination", 
      fare: selectedRide.price,
      status: 'upcoming',
      driver: {
        name: randomDriver,
        rating: 4.8,
        vehicle: randomVehicle
      },
      type: selectedRide.type,
      distance: distance.toFixed(1)
    });

    setBookingStatus('booked');
    
    // Redirect
    setTimeout(() => {
      router.push('/history');
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold mb-6">Book a Ride</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-4rem)]">
        {/* Left Column: Form or Payment */}
        <div className="lg:col-span-1 h-fit">
          {!selectedRide ? (
            <>
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
                    <li>Select your ride options and proceed to payment!</li>
                </ol>
              </div>
            </>
          ) : (
            <div className="bg-card border rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Complete Payment</h2>
                <button 
                  onClick={() => setSelectedRide(null)}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Back
                </button>
              </div>
              <div className="mb-6 p-4 bg-muted/50 rounded-md space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Ride Type:</span>
                  <span className="font-medium capitalize">{selectedRide.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span className="font-medium">{distance} km</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span>${selectedRide.price.toFixed(2)}</span>
                </div>
              </div>
              <StripeCheckout 
                amount={selectedRide.price} 
                onSuccess={handlePaymentSuccess} 
              />
            </div>
          )}
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
