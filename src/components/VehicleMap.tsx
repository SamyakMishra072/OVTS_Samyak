"use client";

import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { MapPin } from "lucide-react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const useMapEvents = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMapEvents),
  { ssr: false }
);

function LocationMarker({
  position,
  setPosition,
}: {
  position: LatLngExpression;
  setPosition: (p: LatLngExpression) => void;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const map = (useMapEvents as any)?.({
    click(e: any) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} />;
}

export default function VehicleMap({
  position,
  setPosition,
}: {
  position: LatLngExpression;
  setPosition: (p: LatLngExpression) => void;
}) {
  return (
    <div className="relative h-[500px]">
      <MapContainer
        center={position}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      <div className="absolute top-3 left-3 bg-white/80 px-3 py-1 rounded-md text-sm flex items-center gap-2 shadow">
        <MapPin size={16} className="text-blue-600" />
        Click anywhere to select location
      </div>
    </div>
  );
}
