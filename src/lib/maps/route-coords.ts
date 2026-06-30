export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface TripMapData {
  from: MapCoordinates;
  to: MapCoordinates;
  pickup?: MapCoordinates;
  live?: MapCoordinates;
}

/** NYC-area coordinates for demo routes and named locations. */
const LOCATION_COORDS: Record<string, MapCoordinates> = {
  "brooklyn heights": { lat: 40.696, lng: -73.994 },
  "midtown manhattan": { lat: 40.754, lng: -73.984 },
  queens: { lat: 40.728, lng: -73.794 },
  "financial district": { lat: 40.707, lng: -74.009 },
  "jersey city": { lat: 40.728, lng: -74.078 },
  soho: { lat: 40.723, lng: -74.0 },
  "park slope": { lat: 40.671, lng: -73.981 },
  "union square": { lat: 40.736, lng: -73.99 },
  williamsburg: { lat: 40.708, lng: -73.957 },
  "wall street": { lat: 40.707, lng: -74.011 },
  astoria: { lat: 40.764, lng: -73.923 },
  chelsea: { lat: 40.746, lng: -74.001 },
  dumbo: { lat: 40.703, lng: -73.989 },
  "times square": { lat: 40.758, lng: -73.985 },
};

const DEFAULT_FROM: MapCoordinates = { lat: 40.696, lng: -73.994 };
const DEFAULT_TO: MapCoordinates = { lat: 40.754, lng: -73.984 };

function lookup(label: string): MapCoordinates | null {
  const key = label.toLowerCase().trim();
  if (LOCATION_COORDS[key]) return LOCATION_COORDS[key];

  for (const [name, coords] of Object.entries(LOCATION_COORDS)) {
    if (key.includes(name) || name.includes(key)) return coords;
  }
  return null;
}

export function resolveTripMapData(input: {
  from: string;
  to: string;
  pickupPoint?: string;
  liveLocation?: { lat?: number; lng?: number; label?: string };
}): TripMapData {
  const from = lookup(input.from) ?? DEFAULT_FROM;
  const to = lookup(input.to) ?? DEFAULT_TO;

  const pickup =
    (input.pickupPoint ? lookup(input.pickupPoint) : null) ??
    midpoint(from, to, 0.35);

  const live =
    input.liveLocation?.lat != null && input.liveLocation?.lng != null
      ? { lat: input.liveLocation.lat, lng: input.liveLocation.lng }
      : undefined;

  return { from, to, pickup, live };
}

function midpoint(a: MapCoordinates, b: MapCoordinates, t: number): MapCoordinates {
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}

export function buildRoutePolyline(data: TripMapData): MapCoordinates[] {
  const points = [data.from];
  if (data.pickup) points.push(data.pickup);
  if (data.live) points.push(data.live);
  points.push(data.to);
  return points;
}
