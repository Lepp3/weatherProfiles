import { CODESMAP } from '../constants.js';

// string formatting
export function getWeatherDescription(code) {
  return CODESMAP[code] || 'Unknown Weather Code';
}

export function extractLatAndLong(annotations) {
  const latitude = annotations.DMS.lat.split(' ')[2].slice(0, 5);
  const longitude = annotations.DMS.lng.split(' ')[2].slice(0, 5);
  return [latitude, longitude];
}

// local storage manipulation

export function getCachedData(key) {
  const cachedData = localStorage.getItem(key);
  return cachedData ? JSON.parse(cachedData) : null;
}

export function setCachedData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function clearCachedData(key) {
  localStorage.removeItem(key);
}
