"use client"

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icons need to be created on client side only
const createIcon = (color: string) => {
  if (typeof window === 'undefined') return null;
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 drop-shadow-md">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="white"></circle>
      </svg>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface Location {
    lat: number;
    lng: number;
    address?: string;
}

// Function to fetch address from coordinates
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        return data.display_name || "Unknown Location";
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return "Pin Location"; 
    }
};


interface MapProps {
    pickup: Location | null;
    dropoff: Location | null;
    setPickup: (loc: Location | null) => void;
    setDropoff: (loc: Location | null) => void;
    onRouteFound?: (distance: number, duration: number) => void;
    readOnly?: boolean;
}

function MapController({ pickup, dropoff, setPickup, setDropoff, onRouteFound, readOnly }: MapProps) {
    const map = useMap();
    const routingControlRef = useRef<L.Routing.Control | null>(null);

    // Auto-fit bounds & Routing
    useEffect(() => {
        if (!map || typeof window === 'undefined') return;
        
        // Dynamically load routing machine on client only
        // @ts-ignore
        if (!L.Routing) {
            require('leaflet-routing-machine');
        }

        // Cleanup previous routing control
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
            routingControlRef.current = null;
        }

        if (pickup && dropoff && L.Routing) {
            // Immediate feedback: fit bounds to include both points
            const bounds = L.latLngBounds([
                [pickup.lat, pickup.lng],
                [dropoff.lat, dropoff.lng]
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });

            // Add Routing Control
            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(pickup.lat, pickup.lng),
                    L.latLng(dropoff.lat, dropoff.lng)
                ],
                show: false, // Hide instructions
                addWaypoints: false, // Disable dragging
                routeWhileDragging: false,
                fitSelectedRoutes: true,
                showAlternatives: false,
                createMarker: function() { return null; }, // Disable default markers
                lineOptions: {
                    styles: [{ color: 'blue', weight: 4, opacity: 0.7 }],
                    extendToWaypoints: true,
                    missingRouteTolerance: 0
                }
            } as any);

            routingControl.on('routesfound', (e: any) => {
                const routes = e.routes;
                if (routes && routes.length > 0) {
                    const summary = routes[0].summary;
                    // totalDistance in meters, totalTime in seconds
                    if (onRouteFound) {
                        onRouteFound(summary.totalDistance, summary.totalTime);
                    }
                }
            });

            routingControl.addTo(map);
            routingControlRef.current = routingControl;
        } else if (pickup) {
             map.flyTo(pickup, 13);
        }

        return () => {
            if (routingControlRef.current) {
                map.removeControl(routingControlRef.current);
                routingControlRef.current = null;
            }
        };
    }, [pickup, dropoff, map, onRouteFound]);

    // Handle clicks
    useMapEvents({
        async click(e) {
            if (readOnly) return; 

            const address = await reverseGeocode(e.latlng.lat, e.latlng.lng);
            const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng, address };
            
            if (!pickup) {
                setPickup(newLocation);
            } else if (!dropoff) {
                setDropoff(newLocation);
            } else {
                setPickup(newLocation);
                setDropoff(null);
            }
        }
    });

    return null;
}

export default function Map({ pickup, dropoff, setPickup, setDropoff, onRouteFound, readOnly }: MapProps) {
    const [icons, setIcons] = useState<{ pickupIcon: L.DivIcon, dropoffIcon: L.DivIcon } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pIcon = createIcon('#16a34a'); // Green
            const dIcon = createIcon('#dc2626'); // Red
            if (pIcon && dIcon) {
                setIcons({ pickupIcon: pIcon, dropoffIcon: dIcon });
            }
        }
    }, []);

    if (!icons) return null; // Don't render map until icons/client is ready

    return (
        <MapContainer 
            center={[28.6139, 77.2090]} 
            zoom={11} 
            scrollWheelZoom={!readOnly} 
            className="w-full h-full min-h-[400px] z-0 rounded-md"
            dragging={!readOnly}
            doubleClickZoom={!readOnly}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapController 
                pickup={pickup} 
                dropoff={dropoff} 
                setPickup={setPickup} 
                setDropoff={setDropoff} 
                onRouteFound={onRouteFound}
                readOnly={readOnly}
            />

            {pickup && (
                <Marker position={pickup} icon={icons.pickupIcon}>
                     <Popup>{pickup.address || "Pickup Location"}</Popup>
                </Marker>
            )}

            {dropoff && (
                <Marker position={dropoff} icon={icons.dropoffIcon}>
                     <Popup>{dropoff.address || "Dropoff Location"}</Popup>
                </Marker>
            )}
        </MapContainer>
    );
}

