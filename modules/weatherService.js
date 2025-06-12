import { WEATHER_API_URL } from "../constants.js";
import { apiFetch, getWeatherDescription } from "./utils.js";


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

export async function updateWeatherData(latitude, longitude) {
    const queryParam = `?latitude=${latitude}&longitude=${longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`;
    const url = `${WEATHER_API_URL}${queryParam}`;
    try {
        const result = await apiFetch(url);
        let weatherCondition = getWeatherDescription(result.current.weather_code);
        let temperature = result.current.temperature_2m;
        let humidity = result.current.relative_humidity_2m;
        return { weatherCondition, temperature, humidity };
    } catch (error) {
        console.error("Error fetching weather data: " + error.message);
        throw error;
    }

}