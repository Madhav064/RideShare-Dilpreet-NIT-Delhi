"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useRideHistory } from "@/hooks/useRideHistory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, MapPin, Calendar } from "lucide-react";

export default function RideHistoryPage() {
  const { rides } = useRideHistory();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Upcoming</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8" /> Your Rides
        </h1>
        <Button asChild>
            <Link href="/book">Book New Ride</Link>
        </Button>
      </div>

      {rides.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Car className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">No rides yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              You haven't taken any rides with us yet. Start your journey today!
            </p>
            <Button asChild size="lg">
              <Link href="/book">Book a Ride</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Dropoff</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead className="text-right">Fare</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {format(new Date(ride.date), "MMM d, yyyy h:mm a")}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={ride.pickup}>
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-green-600" /> {ride.pickup}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={ride.dropoff}>
                     <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-600" /> {ride.dropoff}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium">{ride.driver?.name || "Assigning..."}</span>
                        <span className="text-xs text-muted-foreground">{ride.driver?.vehicle}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${ride.fare.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(ride.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
