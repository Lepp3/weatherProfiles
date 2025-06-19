import { CODESMAP, WEATHER_API_URL } from '../constants.js';
import { apiFetch } from './api.js';
import { getWeatherDescription } from './utils.js';
import { LatitudeAndLongitude, WeatherConditions } from '../types/weatherTypes.js';
import { WeatherResponseApi } from '../types/responseTypes.js';
import { WeatherApiResponseSchema } from '../types/apiValidation.js';

export async function getWeather(geoInfo:LatitudeAndLongitude):Promise<WeatherConditions | null>{
  const queryParam = `?latitude=${geoInfo.latitude}&longitude=${geoInfo.longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`;
  const url = `${WEATHER_API_URL}${queryParam}`;
  let rawData
  try {
    rawData = await apiFetch(url);
    const weatherApiResults = WeatherApiResponseSchema.safeParse(rawData);
    if(!weatherApiResults.success){
      console.error(weatherApiResults.error.format());
      return null
    }
    const condition = getWeatherDescription(weatherApiResults.data.current.weather_code as keyof typeof CODESMAP);
    const temperature = weatherApiResults.data.current.temperature_2m;
    const humidity = weatherApiResults.data.current.relative_humidity_2m;
    return {condition, temperature, humidity};
  } catch (error) {
    error instanceof Error ? console.error('Error fetching weather data: ' + error.message) : console.error('Error fetching weather data: ' + String(error));
    
    return null;
  }
}
