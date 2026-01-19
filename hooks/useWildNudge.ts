import { useState, useEffect } from 'react';
import { DangerZone, MOCKED_ZONES } from '../data/dangerZones';

const COOLDOWN_MS = 60000; // 1 minute cooldown between nudges

// Haversine formula to calculate distance in meters
const getDistanceFromLatLonInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Radius of the earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in meters
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export const useWildNudge = () => {
  const [activeNudge, setActiveNudge] = useState<DangerZone | null>(null);
  const [lastTriggerTime, setLastTriggerTime] = useState<number>(0);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      console.log("Geolocation not supported. Falling back to simulation logic (inactive).");
      return;
    }

    const handlePosition = (position: GeolocationPosition) => {
      const now = Date.now();
      // Check cooldown
      if (activeNudge || (now - lastTriggerTime < COOLDOWN_MS)) return;

      const { latitude, longitude } = position.coords;

      // Check all danger zones
      for (const zone of MOCKED_ZONES) {
        const distance = getDistanceFromLatLonInMeters(
          latitude, 
          longitude, 
          zone.lat, 
          zone.lng
        );

        if (distance <= zone.radius) {
          setActiveNudge(zone);
          setLastTriggerTime(now);
          // Vibrate if on mobile
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          break; // Trigger only one at a time
        }
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      console.warn("Geolocation access denied or error:", error.message);
      // Optional: You could enable the simulation fallback here if you wanted
    };

    const watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, [activeNudge, lastTriggerTime]);

  const dismissNudge = () => setActiveNudge(null);
  
  // Developer Tool Trigger (Manual Override)
  const triggerNudge = (zone: DangerZone) => setActiveNudge(zone);

  return { activeNudge, dismissNudge, triggerNudge };
};