export const API_KEY = 'e2677f93e4454538a03b9d349a7c8664';
export const USER_API_URL =
  'https://randomuser.me/api/?results=5&inc=gender,name,nat,picture,location&noinfo';
export const GEO_API_URL = 'https://api.opencagedata.com/geocode/v1/json';
export const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
export const CODESMAP = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Dense Drizzle',
  56: 'Light Freezing Drizzle',
  57: 'Dense Freezing Drizzle',
  61: 'Slight Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  66: 'Light Freezing Rain',
  67: 'Heavy Freezing Rain',
  71: 'Slight Snow Fall',
  73: 'Snow Fall',
  75: 'Heavy Snow Fall',
  77: 'Snow Grains',
  80: 'Slight Rain Showers',
  81: 'Moderate Rain Showers',
  82: 'Violent Rain Showers',
  85: 'Slight Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Slight or Moderate Thunderstorm',
  96: 'Thunderstorm with Slight Hail',
  99: 'Thunderstorm with Heavy Hail',
} as const;

export type WeatherCode = keyof typeof CODESMAP;
export type WeatherDescription = typeof CODESMAP[WeatherCode];
