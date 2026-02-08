"use client";

import { useEffect, useState } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationSearchResult {
  x: number; // lng
  y: number; // lat
  label: string;
  raw: any;
}

interface LocationSearchProps {
  onSelect: (location: { lat: number; lng: number; address: string }) => void;
  placeholder: string;
  initialValue?: string;
  className?: string;
}

export function LocationSearch({ onSelect, placeholder, initialValue = "", className }: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);

  // Initialize provider using OSM (Nominatim)
  // Restrict to India (in) and prioritize English results
  const provider = new OpenStreetMapProvider({
    params: {
      countrycodes: "in",
      "accept-language": "en",
    },
  });

  useEffect(() => {
    // Basic debounce logic
    const timeoutId = setTimeout(async () => {
      if (query.length > 2 && query !== value) {
        setLoading(true);
        try {
          // @ts-ignore - leaflet-geosearch types are sometimes tricky
          const searchResults = await provider.search({ query });
          setResults(searchResults as unknown as LocationSearchResult[]);
        } catch (error) {
          console.error("Geosearch error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (result: LocationSearchResult) => {
    setValue(result.label);
    setQuery(result.label);
    onSelect({
      lat: result.y,
      lng: result.x,
      address: result.label,
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between font-normal ${!value && "text-muted-foreground"}`}
        >
          <span className="truncate">{value || placeholder}</span>
          <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[300px]" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={placeholder} 
            value={query} 
            onValueChange={setQuery} 
            className="h-9"
          />
          <CommandList>
             {loading && <CommandEmpty>Data fetching...</CommandEmpty>}
             {!loading && results.length === 0 && query.length > 2 && <CommandEmpty>No locations found.</CommandEmpty>}
             
             <CommandGroup>
                {results.map((result, idx) => (
                  <CommandItem
                    key={`${result.x}-${result.y}-${idx}`}
                    value={result.label}
                    onSelect={() => handleSelect(result)}
                    className="cursor-pointer"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{result.label}</span>
                  </CommandItem>
                ))}
             </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
