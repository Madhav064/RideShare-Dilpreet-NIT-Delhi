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
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50 dark:bg-zinc-950 flex transition-colors">
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto w-full">
        
        {/* Hero Section */}
        <div className="relative h-[500px] w-full overflow-hidden bg-zinc-950 flex items-center rounded-3xl p-8 md:p-10 shadow-lg group">
          
          {/* The Glow Orb */}
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/10 text-white">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available cars nearby
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white">{displayName}</span>!
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl max-w-lg">
                Ready to get moving? Choose your destination and ride in comfort.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/book">
                <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 border-0 font-bold px-8 h-14 text-lg rounded-full shadow-2xl hover:shadow-white/25 transition-all">
                  Book a Ride
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Recent Activity */}
          <Card className="rounded-3xl shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col">
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
                <h3 className="font-bold text-lg mb-1 text-zinc-900 dark:text-zinc-50">
                  {latestRide ? latestRide.dropoff : "12th St to Main St"}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 
                  {latestRide ? new Date(latestRide.date).toLocaleDateString() : "Yesterday, 6:45 PM"}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50">{latestRide ? formatCurrency(latestRide.fare) : formatCurrency(12.50)}</span>
                <Button variant="outline" size="sm" className="rounded-full h-8 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                  Receipt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Wallet */}
          <Card className="rounded-3xl shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-start">
                <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Balance</span>
                <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full">
                  <Wallet className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{formatCurrency(3450)}</span>
              </div>
              
              <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-3 rounded-2xl">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Auto-reload</span>
                <Switch aria-label="Toggle auto-reload" />
              </div>

              <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-xl h-11 font-semibold text-base shadow-lg shadow-zinc-200 dark:shadow-none">
                Top Up Wallet
              </Button>
            </CardContent>
          </Card>

          {/* Card 3: Quick Locations */}
          <Card className="rounded-3xl shadow-sm border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-900 dark:text-zinc-50">Saved Places</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-full text-zinc-900 dark:text-zinc-100 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                    <HomeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">Home</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">2464, Chanakyapuri, Delhi</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 h-8 w-8">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-full text-zinc-900 dark:text-zinc-100 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">University</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">NIT Delhi Campus</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 h-8 w-8">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
              
              <Button variant="ghost" className="w-full text-zinc-900 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 justify-start px-2">
                <span className="text-2xl mr-2 leading-none pb-1">+</span> Add New Place
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Traffic Updates */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative min-h-[140px] p-6 flex items-center bg-zinc-900 dark:bg-zinc-900 text-white">
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
                <p className="text-zinc-400 text-sm">Usually 15 min to Home</p>
              </div>
              <ChevronRight className="w-6 h-6 text-zinc-600" />
            </div>
          </div>

          {/* Refer a Friend */}
          <div className="rounded-3xl bg-zinc-900 dark:bg-zinc-800 text-white p-6 flex items-center justify-between shadow-lg shadow-zinc-200 dark:shadow-none">
             <div className="space-y-2">
                <div className="bg-white/20 w-fit p-2 rounded-xl backdrop-blur-sm">
                   <Gift className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Refer a Friend</h3>
                <p className="text-zinc-400 text-sm max-w-[180px]">Get {formatCurrency(500)} for every friend who books their first ride.</p>
             </div>
             <Button className="bg-white text-zinc-900 hover:bg-zinc-100 border-0 font-bold rounded-xl h-10 px-6">
                Invite
             </Button>
          </div>

        </div>

      </main>
    </div>
  );
}



