import { WEATHER_API_URL } from '../constants.js';
import { apiFetch } from './api.js';
import { getWeatherDescription } from './utils.js';
export async function getWeather(geoInfo) {
    const queryParam = `?latitude=${geoInfo.latitude}&longitude=${geoInfo.longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`;
    const url = `${WEATHER_API_URL}${queryParam}`;
    try {
        const result = await apiFetch(url);
        const condition = getWeatherDescription(result.current.weather_code);
        const temperature = result.current.temperature_2m;
        const humidity = result.current.relative_humidity_2m;
        return { condition, temperature, humidity };
    }
    catch (error) {
        error instanceof Error ? console.error('Error fetching weather data: ' + error.message) : console.error('Error fetching weather data: ' + String(error));
        return null;
    }
}
