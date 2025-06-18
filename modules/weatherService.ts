import { CODESMAP, WEATHER_API_URL } from '../constants.js';
import { apiFetch } from './api.js';
import { getWeatherDescription } from './utils.js';
import { LatitudeAndLongitude, WeatherConditions } from '../types/weatherTypes.js';
import { WeatherResponseApi } from '../types/responseTypes.js';

export async function getWeather(geoInfo:LatitudeAndLongitude):Promise<WeatherConditions | null>{
  const queryParam = `?latitude=${geoInfo.latitude}&longitude=${geoInfo.longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`;
  const url = `${WEATHER_API_URL}${queryParam}`;
  try {
    const result = await apiFetch<Promise<WeatherResponseApi>>(url);
    const condition = getWeatherDescription(result.current.weather_code as keyof typeof CODESMAP);
    const temperature = result.current.temperature_2m;
    const humidity = result.current.relative_humidity_2m;
    return {condition, temperature, humidity};
  } catch (error) {
    error instanceof Error ? console.error('Error fetching weather data: ' + error.message) : console.error('Error fetching weather data: ' + String(error));
    
    return null;
  }
}
