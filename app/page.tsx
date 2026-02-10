"use client";

import Link from "next/link";
import { useRideContext } from "@/context/RideContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/utils";
import { 
  MapPin, 
  Clock, 
  Wallet, 
  Settings, 
  Home as HomeIcon,
  Map as MapIcon,
  Gift,
  Pencil,
  ChevronRight,
  Navigation,
  CheckCircle2
} from "lucide-react";


export default function Home() {
  const { rides } = useRideContext();
  const { user } = useAuth();
  const displayName = user?.username || user?.firstName || "Back"; // Simple "Welcome Back!" if no name
  const latestRide = rides && rides.length > 0 ? rides[0] : null;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-background flex transition-colors">
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto w-full">
        
        {/* Hero Section */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available cars nearby
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Welcome {displayName}!
              </h1>
              <p className="text-blue-100 text-lg md:text-xl max-w-lg">
                Ready to get moving? Choose your destination and ride in comfort.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/book-ride">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0 font-bold px-8 h-12 shadow-xl hover:shadow-2xl transition-all">
                  Book a Ride
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Recent Activity */}
          <Card className="rounded-3xl shadow-sm border-gray-100 dark:border-border dark:bg-card overflow-hidden flex flex-col">
            <div className="h-32 bg-muted relative">
              {/* Using Unsplash source for map styled image */}
              <img 
                src="https://www.shutterstock.com/image-vector/city-map-navigation-gps-navigator-600nw-2449090895.jpg" 
                alt="Route Map" 
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
              <Badge className="absolute top-3 right-3 bg-white/90 text-green-700 hover:bg-white backdrop-blur-sm shadow-sm border-0 font-semibold gap-1 dark:bg-black/80 dark:text-green-400">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </Badge>
            </div>
            <CardContent className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">
                  {latestRide ? latestRide.dropoff : "12th St to Main St"}
                </h3>
                <p className="text-muted-foreground text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 
                  {latestRide ? new Date(latestRide.date).toLocaleDateString() : "Yesterday, 6:45 PM"}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="font-bold text-xl">{latestRide ? formatCurrency(latestRide.fare) : formatCurrency(12.50)}</span>
                <Button variant="outline" size="sm" className="rounded-full h-8 border-gray-200 dark:border-border">
                  Receipt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Wallet */}
          <Card className="rounded-3xl shadow-sm border-gray-100 dark:border-border dark:bg-card flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-start">
                <span className="text-gray-500 dark:text-muted-foreground text-sm font-medium uppercase tracking-wider">Total Balance</span>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full">
                  <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold tracking-tight">{formatCurrency(3450)}</span>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 dark:bg-muted p-3 rounded-2xl">
                <span className="text-sm font-medium text-gray-700 dark:text-foreground">Auto-reload</span>
                <Switch aria-label="Toggle auto-reload" />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-semibold text-base shadow-blue-200 dark:shadow-none shadow-lg">
                Top Up Wallet
              </Button>
            </CardContent>
          </Card>

          {/* Card 3: Quick Locations */}
          <Card className="rounded-3xl shadow-sm border-gray-100 dark:border-border dark:bg-card">
            <CardHeader>
              <CardTitle className="text-lg">Saved Places</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-muted transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2.5 rounded-full text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                    <HomeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-foreground">Home</p>
                    <p className="text-xs text-gray-500 dark:text-muted-foreground">2464, Chanakyapuri, Delhi</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground h-8 w-8">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-muted transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-full text-orange-600 dark:text-orange-400 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-foreground">University</p>
                    <p className="text-xs text-gray-500 dark:text-muted-foreground">NIT Delhi Campus</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-400 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground h-8 w-8">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
              
              <Button variant="ghost" className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 justify-start px-2">
                <span className="text-2xl mr-2 leading-none pb-1">+</span> Add New Place
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Traffic Updates */}
          <div className="rounded-3xl border border-gray-200 dark:border-border overflow-hidden relative min-h-[140px] p-6 flex items-center bg-zinc-900 dark:bg-card text-white">
            <div className="absolute inset-0 opacity-40">
               {/* Traffic abstract image */}
               <img src="/images/trafficmap.png" className="w-full h-full object-cover" alt="Traffic Map" />
            </div>
            {/* Gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold mb-1">
                  <Navigation className="w-4 h-4" /> Live Traffic
                </div>
                <h3 className="text-xl font-bold">Clear roads ahead</h3>
                <p className="text-gray-400 text-sm">Usually 15 min to Home</p>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Refer a Friend */}
          <div className="rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 text-white p-6 flex items-center justify-between shadow-lg shadow-pink-200 dark:shadow-none">
             <div className="space-y-2">
                <div className="bg-white/20 w-fit p-2 rounded-xl backdrop-blur-sm">
                   <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Refer a Friend</h3>
                <p className="text-pink-100 text-sm max-w-[180px]">Get {formatCurrency(500)} for every friend who books their first ride.</p>
             </div>
             <Button className="bg-white text-pink-600 hover:bg-pink-50 border-0 font-bold rounded-xl h-10 px-6">
                Invite
             </Button>
          </div>

        </div>

      </main>
    </div>
  );
}



