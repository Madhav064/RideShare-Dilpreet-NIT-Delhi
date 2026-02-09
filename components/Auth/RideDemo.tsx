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
    <div className="w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl text-white transition-all duration-500">
      
      {/* Step 0: Searching */}
      {step === 0 && (
        <div className="flex flex-col items-center py-4 animate-in fade-in zoom-in duration-500">
          <div className="relative mb-4">
             {/* Pulse Effect */}
             <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
             <div className="relative bg-blue-500 p-4 rounded-full shadow-lg">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
             </div>
          </div>
          <h3 className="font-semibold text-lg">Finding nearby drivers...</h3>
          <p className="text-blue-200 text-sm mt-1">Connecting to network</p>
        </div>
      )}

      {/* Step 1: Matched */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-green-300 font-medium mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Driver Found!
            </div>
            
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden border-2 border-white/50">
                   <User className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-bold text-lg leading-tight">Rajesh K.</h4>
                  <div className="flex items-center text-sm text-yellow-300 gap-1">
                      <Star className="w-3 h-3 fill-yellow-300" />
                      <span>4.9</span>
                      <span className="text-blue-200 ml-1">• Toyota Innova</span>
                  </div>
               </div>
            </div>

            <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
                <span className="text-sm font-mono">DL 1RC 8888</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded text-white">White</span>
            </div>
        </div>
      )}

      {/* Step 2: Arriving */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="flex items-center gap-3 mb-2">
                 <div className="bg-blue-500/30 p-2 rounded-lg">
                    <Navigation className="w-5 h-5 text-blue-200" />
                 </div>
                 <div>
                    <h3 className="font-semibold">Arriving in 2 mins</h3>
                    <p className="text-xs text-blue-200">Usually 1 min faster</p>
                 </div>
             </div>

             {/* Progress Animation */}
             <div className="relative pt-6 pb-2">
                 {/* Track */}
                 <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                     {/* Fill */}
                     <div className="h-full bg-green-400 rounded-full w-full origin-left animate-[progress_4s_ease-out_infinite]" 
                          style={{ animationDuration: '4s', animationTimingFunction: 'linear' }}
                     />
                 </div>
                 
                 {/* Moving Car */}
                 <div className="absolute top-1 left-0 w-full">
                     <div className="absolute -translate-x-1/2 animate-[progress_4s_linear_infinite]" 
                          style={{ left: '0%', animationName: 'moveCar' }}>
                          <Car className="w-6 h-6 text-white fill-blue-600" />
                     </div>
                 </div>
             </div>

             <div className="flex justify-between text-xs text-blue-200 mt-1">
                 <span>200m away</span>
                 <span>Your Location</span>
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
