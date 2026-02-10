"use client";

import { useEffect, useState } from "react";
import { Car, MapPin, Star, User, Loader2, Navigation } from "lucide-react";

export function RideDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 4000); // Cycle every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-80 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl text-white transition-all duration-500">
      
      {/* Step 0: Searching */}
      {step === 0 && (
        <div className="flex flex-col items-center py-4 animate-in fade-in zoom-in duration-500">
          <div className="relative mb-4">
             {/* Pulse Effect */}
             <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
             <div className="relative bg-zinc-800 p-4 rounded-full shadow-lg border border-white/10">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
             </div>
          </div>
          <h3 className="font-semibold text-lg text-white">Finding nearby drivers...</h3>
          <p className="text-zinc-400 text-sm mt-1">Connecting to premium network</p>
        </div>
      )}

      {/* Step 1: Matched */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-white font-medium mb-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                Driver Found
            </div>
            
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-full flex items-center justify-center text-white overflow-hidden border border-white/20 shadow-inner">
                   <User className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="font-bold text-lg leading-tight text-white">Rajesh K.</h4>
                  <div className="flex items-center text-sm text-zinc-400 gap-1.5 mt-0.5">
                      <div className="flex items-center text-white">
                        <Star className="w-3 h-3 fill-white" />
                        <span className="ml-0.5 font-semibold">4.9</span>
                      </div>
                      <span className="text-zinc-600">•</span>
                      <span>Mercedes S-Class</span>
                  </div>
               </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-3 rounded-lg flex justify-between items-center backdrop-blur-sm">
                <span className="text-sm font-mono text-zinc-300 tracking-wider">DL 1RC 8888</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white text-black px-2 py-0.5 rounded-sm">Black</span>
            </div>
        </div>
      )}

      {/* Step 2: Arriving */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-3 mb-2">
                 <div className="bg-zinc-800 p-2 rounded-lg border border-white/5">
                    <Navigation className="w-5 h-5 text-white" />
                 </div>
                 <div>
                    <h3 className="font-semibold text-white">Arriving in 2 mins</h3>
                    <p className="text-xs text-zinc-400">Usually 1 min faster</p>
                 </div>
             </div>

             {/* Progress Animation */}
             <div className="relative pt-6 pb-2">
                 {/* Track */}
                 <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                     {/* Fill */}
                     <div className="h-full bg-white rounded-full w-full origin-left animate-[progress_4s_ease-out_infinite]" 
                          style={{ animationDuration: '4s', animationTimingFunction: 'linear' }}
                     />
                 </div>
                 
                 {/* Moving Car */}
                 <div className="absolute top-1 left-0 w-full">
                     <div className="absolute -translate-x-1/2 animate-[progress_4s_linear_infinite]" 
                          style={{ left: '0%', animationName: 'moveCar' }}>
                          <div className="bg-zinc-950 p-1 rounded-full border border-zinc-800 shadow-xl">
                            <Car className="w-4 h-4 text-white" />
                          </div>
                     </div>
                 </div>
             </div>

             <div className="flex justify-between text-xs text-zinc-500 mt-1 font-medium tracking-wide">
                 <span>0.2 km</span>
                 <span>Pickup</span>
             </div>
             
             {/* Inline styles for custom keyframes if not in tailwind config */}
             <style jsx>{`
               @keyframes moveCar {
                 0% { left: 0%; }
                 100% { left: 100%; }
               }
               @keyframes progress {
                 0% { width: 0%; }
                 100% { width: 100%; }
               }
             `}</style>
        </div>
      )}
    </div>
  );
}
