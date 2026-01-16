export interface DangerZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  riskType: 'SHOPPING' | 'DINING' | 'ENTERTAINMENT';
  message: string;
}

export const MOCKED_ZONES: DangerZone[] = [
  {
    id: 'z1',
    name: 'The Mega Mall',
    lat: 40.7128, 
    lng: -74.0060,
    radius: 500,
    riskType: 'SHOPPING',
    message: 'A wild IMPULSE BUY appeared! Use "Walk Away" to save 50 XP!'
  },
  {
    id: 'z2',
    name: 'Fancy Latte Cafe',
    lat: 34.0522,
    lng: -118.2437,
    radius: 50,
    riskType: 'DINING',
    message: 'Warning: $7 Latte detected. Is it worth the hydration stats?'
  },
  {
    id: 'z3',
    name: 'Gacha Game Store',
    lat: 35.6762,
    lng: 139.6503,
    radius: 100,
    riskType: 'ENTERTAINMENT',
    message: 'Loot Box Trap detected! Your wallet is trembling.'
  }
];