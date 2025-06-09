import type { Libraries } from '@react-google-maps/api';

// Debug log Google Maps API key
console.log('Google Maps API Key present:', !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

// Google Maps configuration
export const googleMapsConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  libraries: ['places', 'visualization', 'drawing', 'geometry'] as Libraries,
  version: 'weekly' as const,
};

console.log('Google Maps Config:', {
  hasApiKey: !!googleMapsConfig.apiKey,
  libraries: googleMapsConfig.libraries,
  version: googleMapsConfig.version
});

export default googleMapsConfig;
