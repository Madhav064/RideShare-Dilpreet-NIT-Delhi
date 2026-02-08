"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Car, Zap } from "lucide-react";

interface BookingFormProps {
  onRideSelect: (rideType: string, price: number) => void;
  bookingStatus: 'idle' | 'booking' | 'booked';
  distance: number; // in km
}

type RideType = 'economy' | 'premium';

export function BookingForm({ onRideSelect, bookingStatus, distance }: BookingFormProps) {
  const [rideType, setRideType] = useState<RideType>('economy');
  const [isShared, setIsShared] = useState(false);
  const [fare, setFare] = useState(0);

  // Calculate fare whenever dependencies change
  useEffect(() => {
    const calculateFare = () => {
      // Rates
      const rates = {
        economy: { base: 10, perKm: 0.5 },
        premium: { base: 15, perKm: 0.8 },
      };

      let basePrice = rates[rideType].base + (distance * rates[rideType].perKm);
      
      // Shared Ride Discount
      if (isShared) {
        basePrice = basePrice * 0.8;
      }

      return parseFloat(basePrice.toFixed(2));
    };

    const newFare = calculateFare();
    setFare(newFare);
  }, [distance, rideType, isShared]);

  const handleBook = () => {
    onRideSelect(rideType, fare);
  };

  return (
    <Card className="w-full h-full shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
           <Car className="h-5 w-5" /> Ride Details
        </CardTitle>
        <CardDescription>
          {distance > 0 
            ? `Trip Distance: ${distance.toFixed(1)} km` 
            : "Select pickup and dropoff on the map"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Ride Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="ride-type">Vehicle Type</Label>
          <Select 
            value={rideType} 
            onValueChange={(value: RideType) => setRideType(value)}
            disabled={distance === 0}
          >
            <SelectTrigger id="ride-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">
                <div className="flex items-center gap-2">
                  <span>Economy</span>
                  <span className="text-muted-foreground text-xs">($0.50/km)</span>
                </div>
              </SelectItem>
              <SelectItem value="premium">
                 <div className="flex items-center gap-2">
                  <span>Premium</span>
                  <span className="text-muted-foreground text-xs">($0.80/km)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shared Ride Toggle */}
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label className="text-base flex items-center gap-1">
                Shared Ride <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500"/>
            </Label>
            <div className="text-xs text-muted-foreground">
              Save 20% by sharing your ride
            </div>
          </div>
          <Switch
            checked={isShared}
            onCheckedChange={setIsShared}
            disabled={distance === 0}
          />
        </div>

        {/* Price Display */}
        <div className="rounded-md bg-muted p-4 text-center">
             <div className="text-xs uppercase text-muted-foreground font-semibold">Estimated Fare</div>
             <div className="text-3xl font-bold text-primary">
                 ${fare.toFixed(2)}
             </div>
        </div>

      </CardContent>
      <CardFooter>
        <Button 
            className="w-full py-6 text-lg" 
            onClick={handleBook}
            disabled={distance === 0 || bookingStatus === 'booking' || bookingStatus === 'booked'}
        >
            {bookingStatus === 'booking' ? 'Booking...' : 'Book Ride'}
        </Button>
      </CardFooter>
    </Card>
  );
}
