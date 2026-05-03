"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Crosshair, Search } from "lucide-react";

interface MapPickerProps {
  onSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

export default function MapPicker({ onSelect, initialLat, initialLng }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`);
      const data = await res.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch { return `${lat.toFixed(6)}, ${lng.toFixed(6)}`; }
  };

  const searchAddress = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const la = parseFloat(lat), lo = parseFloat(lon);
        mapInstance.current?.setView([la, lo], 16);
        markerRef.current?.setLatLng([la, lo]);
        setCurrentAddress(display_name);
        onSelect(la, lo, display_name);
      }
    } catch {} finally { setSearching(false); }
  };

  const getMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      mapInstance.current?.setView([latitude, longitude], 16);
      markerRef.current?.setLatLng([latitude, longitude]);
      const addr = await reverseGeocode(latitude, longitude);
      setCurrentAddress(addr);
      onSelect(latitude, longitude, addr);
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Prevent double initialization (React strict mode)
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const lat = initialLat || -5.135399;
      const lng = initialLng || 119.412616;

      // Clear any existing map on this container
      if ((mapRef.current as any)?._leaflet_id) {
        return;
      }

      const map = L.map(mapRef.current!, { zoomControl: false }).setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current = marker;
      mapInstance.current = map;

      marker.on("dragend", async () => {
        const pos = marker.getLatLng();
        const addr = await reverseGeocode(pos.lat, pos.lng);
        setCurrentAddress(addr);
        onSelect(pos.lat, pos.lng, addr);
      });

      map.on("click", async (e: any) => {
        marker.setLatLng(e.latlng);
        const addr = await reverseGeocode(e.latlng.lat, e.latlng.lng);
        setCurrentAddress(addr);
        onSelect(e.latlng.lat, e.latlng.lng, addr);
      });

      // Initial reverse geocode
      const addr = await reverseGeocode(lat, lng);
      setCurrentAddress(addr);
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && searchAddress()}
            placeholder="Cari lokasi..."
            className="w-full bg-transparent border border-[#DEE2E6] dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 outline-none transition-colors" />
        </div>
        <button onClick={searchAddress} disabled={searching}
          className="px-4 py-2.5 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-colors">
          {searching ? "..." : "Cari"}
        </button>
        <button onClick={getMyLocation} title="Lokasi saya"
          className="px-3 py-2.5 border border-[#DEE2E6] dark:border-white/10 rounded-xl hover:bg-orange-500/10 transition-colors">
          <Crosshair className="w-4 h-4 text-orange-500" />
        </button>
      </div>

      {/* Map */}
      <div ref={mapRef} className="w-full h-56 rounded-2xl overflow-hidden border border-[#DEE2E6] dark:border-white/10 z-0" />

      {/* Selected address */}
      {currentAddress && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">{currentAddress}</p>
        </div>
      )}
    </div>
  );
}
