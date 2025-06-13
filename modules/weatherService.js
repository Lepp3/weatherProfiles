import { WEATHER_API_URL } from '../constants.js';
import { apiFetch } from './api.js';
import { getWeatherDescription } from './utils.js';

export async function getWeather(latitude,longitude) {
  const queryParam = `?latitude=${latitude}&longitude=${longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`;
  const url = `${WEATHER_API_URL}${queryParam}`;
  try {
    const result = await apiFetch(url);
    const condition = getWeatherDescription(result.current.weather_code);
    const temperature = result.current.temperature_2m;
    const humidity = result.current.relative_humidity_2m;
    return {condition, temperature, humidity};
  } catch (error) {
    console.error('Error fetching weather data: ' + error.message);
    return null;
  }
}
