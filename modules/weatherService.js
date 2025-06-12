import { WEATHER_API_URL } from "../constants.js";
import { apiFetch } from "./api.js";
import { getWeatherDescription } from "./utils.js";


export async function getWeather(user) {
    const queryParam = `?latitude=${user.weather.latitude}&longitude=${user.weather.longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`;
    const url = `${WEATHER_API_URL}${queryParam}`;
    try {
        const result = await apiFetch(url);
        user.weather.condition = getWeatherDescription(result.current.weather_code);
        user.weather.temperature = result.current.temperature_2m;
        user.weather.humidity = result.current.relative_humidity_2m;
        return user;
    } catch (error) {
        console.error("Error fetching weather data: " + error.message);
        return user;

    }

};
