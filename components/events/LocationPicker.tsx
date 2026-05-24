'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Loader2, Navigation, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LocationPickerProps {
    onLocationSelect: (data: {
        name: string;
        address: string;
        lat: number;
        lng: number;
    }) => void;
    defaultLocation?: string;
    defaultLat?: number;
    defaultLng?: number;
    error?: string;
}

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

export function LocationPicker({ 
    onLocationSelect, 
    defaultLocation, 
    defaultLat, 
    defaultLng,
    error 
}: LocationPickerProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey || '',
        libraries,
    });

    // Fallback if no API Key or Load Error
    if (!apiKey || loadError) {
        return (
            <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-500">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-amber-800">Smart Location is Disabled</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                            Google Maps API key is missing or invalid. Please add 
                            <code className="mx-1 px-1 py-0.5 bg-amber-100 rounded text-[10px] font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> 
                            to your <code className="px-1 py-0.5 bg-amber-100 rounded text-[10px] font-mono">.env</code> file.
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-bold">Venue Location (Manual Entry)</Label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
                        <Input
                            defaultValue={defaultLocation}
                            onChange={(e) => onLocationSelect({
                                name: e.target.value,
                                address: e.target.value,
                                lat: 0,
                                lng: 0
                            })}
                            placeholder="Enter venue name or address..."
                            className={cn(
                                "pl-12 h-12 bg-transparent border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl font-medium",
                                error && "border-red-500"
                            )}
                        />
                    </div>
                    {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="space-y-4">
                <div className="relative">
                    <Label className="mb-2 block">Search Location</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input disabled placeholder="Loading maps..." className="pl-10 h-12 rounded-xl" />
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
                    </div>
                </div>
                <div className="rounded-2xl h-[300px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <LocationPickerChild 
            onLocationSelect={onLocationSelect}
            defaultLocation={defaultLocation}
            defaultLat={defaultLat}
            defaultLng={defaultLng}
            error={error}
        />
    );
}

function LocationPickerChild({ 
    onLocationSelect, 
    defaultLocation, 
    defaultLat, 
    defaultLng,
    error 
}: LocationPickerProps) {
    const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(
        defaultLat && defaultLng ? { lat: defaultLat, lng: defaultLng } : null
    );

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: "in" },
        },
        debounce: 300,
        defaultValue: defaultLocation,
        initOnMount: true, // This is key, but it expects google to be there
    });

    const handleSelect = async (suggestion: any) => {
        const { description, structured_formatting } = suggestion;
        setValue(description, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address: description });
            const { lat, lng } = await getLatLng(results[0]);
            
            const locationData = {
                name: structured_formatting.main_text,
                address: description,
                lat,
                lng,
            };
            
            setSelectedPos({ lat, lng });
            onLocationSelect(locationData);
        } catch (error) {
            console.error("Error fetching geocode:", error);
        }
    };

    const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        
        setSelectedPos({ lat, lng });
        
        try {
            const results = await getGeocode({ location: { lat, lng } });
            const address = results[0].formatted_address;
            const name = results[0].address_components[0].long_name;
            
            setValue(address, false);
            onLocationSelect({
                name,
                address,
                lat,
                lng,
            });
        } catch (error) {
            console.error("Error reverse geocoding:", error);
        }
    }, [onLocationSelect, setValue]);

    return (
        <div className="space-y-4">
            <div className="relative">
                <Label className="mb-2 block">Search Location</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={!ready}
                        placeholder="Type to search location..."
                        className={cn(
                            "pl-10 h-12 rounded-xl transition-all",
                            error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-primary"
                        )}
                    />
                </div>

                {status === "OK" && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                        {data.map((suggestion) => (
                            <button
                                key={suggestion.place_id}
                                onClick={() => handleSelect(suggestion)}
                                className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                            >
                                <MapPin className="w-4 h-4 mt-1 text-primary shrink-0" />
                                <div>
                                    <div className="font-semibold text-sm dark:text-white">
                                        {suggestion.structured_formatting.main_text}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                        {suggestion.structured_formatting.secondary_text}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Preview */}
            <div className="relative group">
                <div className="rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm h-[300px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {selectedPos ? (
                        <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={selectedPos}
                            zoom={15}
                            onClick={handleMapClick}
                            options={{
                                disableDefaultUI: false,
                                zoomControl: true,
                                streetViewControl: false,
                                mapTypeControl: false,
                                fullscreenControl: false,
                            }}
                        >
                            <Marker position={selectedPos} />
                        </GoogleMap>
                    ) : (
                        <div className="text-center p-8">
                            <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                <Navigation className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">No Location Selected</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                                Search for a place above to see it on the map or click directly on the map.
                            </p>
                        </div>
                    )}
                </div>

                {selectedPos && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-white shadow-lg h-9 gap-2"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedPos.lat},${selectedPos.lng}`, '_blank')}
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-xs font-bold">Google Maps</span>
                    </Button>
                )}
            </div>

            {error && (
                <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {error}
                </p>
            )}
        </div>
    );
}
