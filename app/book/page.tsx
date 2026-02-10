"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookingForm } from "@/components/BookingForm";
import StripeCheckout from "@/components/StripeCheckout";
import { RideInputPanel } from "@/components/RideInputPanel";
import { FeedbackModal } from "@/components/FeedbackModal";
import { ActiveRidePanel } from "@/components/ActiveRidePanel";
import { useRideHistory } from "@/hooks/useRideHistory";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Dynamically import Map to disable SSR
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center">Loading Map...</div>, // removed rounded-md
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
  const [showFeedback, setShowFeedback] = useState(false);
  const { rides, addRide } = useRideHistory();
  const router = useRouter();

  // Watch for ride completion
  useEffect(() => {
    if (bookingStatus === 'booked' && rides[0]?.status === 'completed') {
       setShowFeedback(true);
    }
  }, [rides, bookingStatus]);

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
    
    // toast.success("Ride Booked! Driver is on the way."); // Removed to avoid duplicate toasts with Stripe & Simulator
  };

  // State to handle searching indicator from Map if needed, but for now simple
  const [isMapCalculated, setIsMapCalculated] = useState(false);

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
      <div className="absolute top-4 left-4 z-10 w-full max-w-[400px] flex flex-col gap-2 pointer-events-none">
          
          {!selectedRide ? (
            <>
              {/* Input Panel */}
              <div className="pointer-events-auto">
                  <RideInputPanel 
                    onPickupSelect={(loc) => {
                       setPickup({ lat: loc.lat, lng: loc.lng });
                       setPickupAddress(loc.address);
                    }}
                    onDropoffSelect={(loc) => {
                       setDropoff({ lat: loc.lat, lng: loc.lng });
                       setDropoffAddress(loc.address);
                    }}
                    isLoading={distance === 0 && !!pickup && !!dropoff} 
                    values={{
                      pickup: pickupAddress,
                      dropoff: dropoffAddress
                    }}
                  />
              </div>

              {/* Booking Form - Reveal when Distance > 0 */}
              {distance > 0 && (
                 <div className="pointer-events-auto animate-in slide-in-from-top-4 fade-in duration-500 rounded-2xl overflow-hidden shadow-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 max-h-[60vh] flex flex-col">
                    <BookingForm 
                      distance={distance} 
                      duration={duration}
                      onRideSelect={handleRideSelect} 
                      bookingStatus={bookingStatus}
                    />
                 </div>
              )}
            </>
          ) : (
             // Payment or Active Ride View
             bookingStatus === 'booked' ? (
                <div className="pointer-events-auto">
                   <ActiveRidePanel 
                     driver={rides[0]?.driver || { name: "Driver", vehicle: "Car", rating: 5.0 }}
                     pickup={rides[0]?.pickup || "Pickup"}
                     dropoff={rides[0]?.dropoff || "Dropoff"}
                     status={rides[0]?.statusMessage || "Processing..."}
                   />
                </div>
             ) : (
                <div className="pointer-events-auto bg-white dark:bg-zinc-950 shadow-2xl rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Payment</h2>
                    <button 
                      onClick={() => setSelectedRide(null)}
                      className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium"
                    >
                      Back
                    </button>
                  </div>
                  
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl space-y-3 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Ride Type</span>
                      <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">{selectedRide.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 dark:text-zinc-400">Distance</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">{distance} km</span>
                    </div>
                    <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-2 flex justify-between items-center">
                      <span className="font-semibold text-base text-zinc-900 dark:text-white">Total</span>
                      <span className="font-bold text-lg text-zinc-900 dark:text-white">{formatCurrency(selectedRide.price)}</span>
                    </div>
                  </div>
                  
                  <StripeCheckout 
                    amount={selectedRide.price} 
                    onSuccess={handlePaymentSuccess} 
                  />
                </div>
             )
          )}
      </div>

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => {
           setShowFeedback(false);
           router.push('/history');
        }}
        driverName={rides[0]?.driver.name || "Driver"}
        onSubmit={(rating, tags, tip) => {
           toast.success("Thanks for your feedback!");
           // Ideally update the ride with rating in context, but for now just proceed
           router.push('/history');
        }}
      />
    </div>
  );
}
