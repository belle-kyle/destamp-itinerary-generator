import axios from 'axios';

export interface Location {
  name: string;
  location: [number, number];
  distance: number;
}

export interface DistanceMatrixResponse {
  code: string;
  durations: number[][];
  distances: number[][];
}

interface RouteMatrixElement {
  originIndex?: number;
  destinationIndex?: number;
  distanceMeters?: number;
  duration?: string;
  condition?: string;
}

const TRAVEL_MODES: Record<string, string> = {
  driving: 'DRIVE',
  walking: 'WALK',
  cycling: 'BICYCLE',
};

// coordinatePairs arrives as "lon,lat;lon,lat;..." (the format the rest of
// the itinerary code already builds via getCoordinatesParam).
const toWaypoints = (coordinatePairs: string) => {
  return coordinatePairs.split(';').map((pair) => {
    const [lon, lat] = pair.split(',').map(Number);
    return {
      waypoint: { location: { latLng: { latitude: lat, longitude: lon } } },
    };
  });
};

// Routes API returns durations as strings like "323s".
const parseDurationSeconds = (duration?: string): number => {
  if (!duration) return 0;
  return parseInt(duration.replace('s', ''), 10) || 0;
};

export const fetchDistanceMatrix = async (
  mode: string,
  coordinatePairs: string,
): Promise<DistanceMatrixResponse> => {
  try {
    const GOOGLE_DISTANCE_MATRIX_API_KEY =
      process.env.GOOGLE_DISTANCE_MATRIX_API_KEY;
    const waypoints = toWaypoints(coordinatePairs);
    const pointCount = waypoints.length;

    const response = await axios.post<RouteMatrixElement[]>(
      'https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix',
      {
        origins: waypoints,
        destinations: waypoints,
        travelMode: TRAVEL_MODES[mode] || 'DRIVE',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_DISTANCE_MATRIX_API_KEY,
          'X-Goog-FieldMask':
            'originIndex,destinationIndex,distanceMeters,duration,condition',
        },
      },
    );

    const distances: number[][] = Array.from({ length: pointCount }, () =>
      new Array(pointCount).fill(0),
    );
    const durations: number[][] = Array.from({ length: pointCount }, () =>
      new Array(pointCount).fill(0),
    );

    response.data.forEach((el) => {
      const i = el.originIndex ?? 0;
      const j = el.destinationIndex ?? 0;
      if (el.condition === 'ROUTE_EXISTS') {
        distances[i]![j] = el.distanceMeters ?? 0;
        durations[i]![j] = parseDurationSeconds(el.duration);
      }
    });

    return { code: 'OK', durations, distances };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { error?: { message?: string } } | undefined)
          ?.error?.message || error.message;
      throw new Error(`Error fetching Google Distance Matrix data: ${message}`);
    }
    throw error;
  }
};
