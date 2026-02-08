"use client";

import { Map } from "lucide-react";
import Image from "next/image";

interface MapThumbnailProps {
  location?: string;
  className?: string;
}

export function MapThumbnail({ location, className }: MapThumbnailProps) {
  return (
    <div className={`w-20 h-20 rounded-lg bg-blue-50 relative overflow-hidden flex items-center justify-center flex-shrink-0 ${className}`}>
        <Image 
          src="https://www.shutterstock.com/image-vector/city-map-navigation-gps-navigator-600nw-2449090895.jpg"
          alt="Map Thumbnail"
          fill
          className="object-cover opacity-80"
          sizes="(max-width: 768px) 100vw, 80px"
        />
    </div>
  );
}
