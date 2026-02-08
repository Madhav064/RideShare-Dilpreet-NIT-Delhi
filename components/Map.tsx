"use client"

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js/Leaflet
// We need to check if window is defined to avoid SSR issues with Leaflet logic
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

let customIcon: L.Icon<L.IconOptions>;

// Initialize icon only on client side
if (typeof window !== 'undefined') {
    customIcon = L.icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

interface Location {
    lat: number;
    lng: number;
}

interface MapProps {
    pickup: Location | null;
    dropoff: Location | null;
    setPickup: (loc: Location | null) => void;
    setDropoff: (loc: Location | null) => void;
}

function MapController({ pickup, dropoff, setPickup, setDropoff }: MapProps) {
    const map = useMap();

    // Auto-fit bounds
    useEffect(() => {
        if (pickup && dropoff) {
            const bounds = L.latLngBounds([pickup, dropoff]);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (pickup) {
            map.flyTo(pickup, 14);
        }
    }, [pickup, dropoff, map]);

    // Handle clicks
    useMapEvents({
        click(e) {
            const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
            
            // Logic: 
            // 1. If no pickup, set pickup.
            // 2. If pickup, but no dropoff, set dropoff.
            // 3. If both, reset and start over at pickup (common UX for simple map pickers)
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

export default function Map({ pickup, dropoff, setPickup, setDropoff }: MapProps) {
    
    // Safety check for icon
    const activeIcon = customIcon || L.icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    return (
        <MapContainer 
            center={[28.6139, 77.2090]} 
            zoom={11} 
            scrollWheelZoom={true} 
            className="w-full h-full min-h-[400px] z-0 rounded-md"
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
            />

            {pickup && (
                <Marker position={pickup} icon={activeIcon}>
                     <Popup>Pickup Location</Popup>
                </Marker>
            )}

            {dropoff && (
                <Marker position={dropoff} icon={activeIcon}>
                     <Popup>Dropoff Location</Popup>
                </Marker>
            )}

            {pickup && dropoff && (
                 <Polyline positions={[pickup, dropoff]} color="blue" />
            )}
        </MapContainer>
    );
}
