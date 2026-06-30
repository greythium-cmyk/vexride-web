"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  buildRoutePolyline,
  resolveTripMapData,
  type TripMapData,
} from "@/lib/maps/route-coords";
import { isGoogleMapsConfigured } from "@/lib/env";

const tealIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#14B8A6;border:2px solid white;box-shadow:0 0 8px rgba(20,184,166,0.6)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const cyanIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#22D3EE;border:2px solid white;box-shadow:0 0 8px rgba(34,211,238,0.6)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const pickupIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:4px;background:#F59E0B;border:2px solid white;transform:rotate(45deg);box-shadow:0 0 8px rgba(245,158,11,0.5)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function MapInner({
  data,
  fromLabel,
  toLabel,
  pickupLabel,
}: {
  data: TripMapData;
  fromLabel: string;
  toLabel: string;
  pickupLabel?: string;
}) {
  const route = buildRoutePolyline(data);
  const center = data.live ?? data.pickup ?? {
    lat: (data.from.lat + data.to.lat) / 2,
    lng: (data.from.lng + data.to.lng) / 2,
  };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      scrollWheelZoom={false}
      className="h-full w-full rounded-xl"
      style={{ background: "#0F172A", minHeight: 144 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Polyline
        positions={route.map((p) => [p.lat, p.lng] as [number, number])}
        pathOptions={{ color: "#14B8A6", weight: 4, opacity: 0.85, dashArray: "8 6" }}
      />
      <Marker position={[data.from.lat, data.from.lng]} icon={tealIcon}>
        <Popup>{fromLabel}</Popup>
      </Marker>
      {data.pickup && (
        <Marker position={[data.pickup.lat, data.pickup.lng]} icon={pickupIcon}>
          <Popup>{pickupLabel ?? "Punto de encuentro"}</Popup>
        </Marker>
      )}
      {data.live && (
        <Marker position={[data.live.lat, data.live.lng]} icon={cyanIcon}>
          <Popup>Ubicación en vivo</Popup>
        </Marker>
      )}
      <Marker position={[data.to.lat, data.to.lng]} icon={cyanIcon}>
        <Popup>{toLabel}</Popup>
      </Marker>
    </MapContainer>
  );
}

function MapPlaceholder({ from, to }: { from: string; to: string }) {
  return (
    <div className="relative flex h-36 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/10 bg-[#0F172A] p-4">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <p className="relative text-xs text-slate-500">Vista de ruta (demo)</p>
      <p className="relative text-sm font-medium text-white">
        {from} → {to}
      </p>
    </div>
  );
}

export function TripMap({
  from,
  to,
  pickupPoint,
  liveLocation,
}: {
  from: string;
  to: string;
  pickupPoint?: string;
  liveLocation?: { lat?: number; lng?: number; label?: string };
}) {
  const data = resolveTripMapData({ from, to, pickupPoint, liveLocation });

  useEffect(() => {
    // Leaflet default marker fix (not used with DivIcon but safe)
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <div className="relative h-36 overflow-hidden rounded-xl border border-white/10">
      <MapInner data={data} fromLabel={from} toLabel={to} pickupLabel={pickupPoint} />
      <span className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] text-slate-400">
        OpenStreetMap · {isGoogleMapsConfigured() ? "Google ready" : "modo demo"}
      </span>
    </div>
  );
}

export { MapPlaceholder };
