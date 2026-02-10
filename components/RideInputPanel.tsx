"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationResult {
  x: number; // lng
  y: number; // lat
  label: string;
}

interface RideInputPanelProps {
  onPickupSelect: (location: { lat: number; lng: number; address: string }) => void;
  onDropoffSelect: (location: { lat: number; lng: number; address: string }) => void;
  isLoading?: boolean;
  values?: {
    pickup?: string;
    dropoff?: string;
  };
}

export function RideInputPanel({ onPickupSelect, onDropoffSelect, isLoading: externalLoading, values }: RideInputPanelProps) {
  const [pickupQuery, setPickupQuery] = useState(values?.pickup || "Current Location");
  const [dropoffQuery, setDropoffQuery] = useState(values?.dropoff || "");
  
  // Sync state if values prop changes (e.g. parent updates or re-mount with existing state)
  useEffect(() => {
    if (values?.pickup) setPickupQuery(values.pickup);
    if (values?.dropoff) setDropoffQuery(values.dropoff);
  }, [values]);
  
  const [pickupResults, setPickupResults] = useState<LocationResult[]>([]);
  const [dropoffResults, setDropoffResults] = useState<LocationResult[]>([]);
  
  const [activeInput, setActiveInput] = useState<"pickup" | "dropoff" | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize provider
  const provider = useMemo(() => new OpenStreetMapProvider({
    params: {
      countrycodes: "in",
      "accept-language": "en",
    },
  }), []);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveInput(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search Logic
  const performSearch = async (query: string, type: "pickup" | "dropoff") => {
    if (query.length < 3) {
      if (type === "pickup") setPickupResults([]);
      else setDropoffResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // @ts-ignore
      const results = await provider.search({ query });
      if (type === "pickup") {
        setPickupResults(results as unknown as LocationResult[]);
      } else {
        setDropoffResults(results as unknown as LocationResult[]);
      }
    } catch (error) {
      console.warn("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced Search Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeInput === "pickup" && pickupQuery !== "Current Location") {
        performSearch(pickupQuery, "pickup");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [pickupQuery, activeInput]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeInput === "dropoff") {
        performSearch(dropoffQuery, "dropoff");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [dropoffQuery, activeInput]);
  
  // Handlers
  const handleSelect = (result: LocationResult, type: "pickup" | "dropoff") => {
    const locationData = {
      lat: result.y,
      lng: result.x,
      address: result.label,
    };

    if (type === "pickup") {
      setPickupQuery(result.label);
      onPickupSelect(locationData);
    } else {
      setDropoffQuery(result.label);
      onDropoffSelect(locationData);
    }
    setActiveInput(null);
  };

  return (
    <div ref={containerRef} className="w-full bg-white dark:bg-zinc-950 rounded-2xl shadow-lg p-4 relative z-50">
      <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">Where to?</h2>
      <div className="flex gap-4">
        {/* Left Column: Visuals */}
        <div className="flex flex-col items-center w-6 shrink-0 gap-3 relative">
          
          {/* Connecting Line */}
          <div className="absolute top-5 bottom-5 w-[1px] bg-zinc-300 dark:bg-zinc-700" />
          
          {/* Pickup Icon matches Input 1 height */}
          <div className="h-11 flex items-center justify-center z-10 w-full">
             <div className="w-3 h-3 border-2 border-zinc-400 rounded-full bg-white dark:bg-zinc-950" />
          </div>
          
          {/* Dropoff Icon matches Input 2 height */}
          <div className="h-11 flex items-center justify-center z-10 w-full">
             <MapPin className="w-4 h-4 text-black dark:text-zinc-100 fill-black dark:fill-zinc-100 bg-white dark:bg-zinc-950" />
          </div>
        </div>

        {/* Right Column: Inputs */}
        <div className="flex-1 flex flex-col gap-3 relative">
          
          {/* Pickup Input */}
          <div className="relative">
             <input
               type="text"
               value={pickupQuery}
               onFocus={() => {
                 setActiveInput("pickup");
                 if (pickupQuery === "Current Location") setPickupQuery("");
               }}
               onChange={(e) => setPickupQuery(e.target.value)}
               placeholder="Current Location"
               className={cn(
                 "w-full h-11 px-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500",
                 "focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm"
               )}
             />
             {/* Dropdown for Pickup */}
             {activeInput === "pickup" && pickupResults.length > 0 && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-2xl z-[60] max-h-64 overflow-y-auto">
                 {pickupResults.map((result, idx) => (
                   <div
                     key={idx}
                     onClick={() => handleSelect(result, "pickup")}
                     className="px-4 py-3.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors"
                   >
                     <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full">
                        <MapPin className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
                     </div>
                     <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200 line-clamp-1">{result.label}</p>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Dropoff Input */}
          <div className="relative">
             <input
               type="text"
               value={dropoffQuery}
               onFocus={() => setActiveInput("dropoff")}
               onChange={(e) => setDropoffQuery(e.target.value)}
               placeholder="Destination"
               className={cn(
                 "w-full h-11 px-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500",
                 "focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all shadow-sm"
               )}
             />
             
             {/* Spinner for Loading */}
             {(isSearching || externalLoading) && activeInput === "dropoff" && (
                <div className="absolute right-3 top-3">
                   <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                </div>
             )}

             {/* Dropdown for Dropoff */}
             {activeInput === "dropoff" && (dropoffResults.length > 0) && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-2xl z-[60] max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                 {dropoffResults.map((result, idx) => (
                   <div
                     key={idx}
                     onClick={() => handleSelect(result, "dropoff")}
                     className="px-4 py-3.5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors"
                   >
                     <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full">
                        <MapPin className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">{result.label.split(',')[0]}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">{result.label}</p>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
