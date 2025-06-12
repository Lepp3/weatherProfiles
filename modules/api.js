import { API_KEY } from '../constants.js';








export async function getGeoInformation(user) {
    const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${user.location.streetName}+${user.location.streetNumber}%2C+${user.location.zipcode}+${user.location.city}%2C+${user.location.country}&key=${API_KEY}`);
    const result = await request.json();
    const [latitude, longitude] = extractLatAndLong(result.results[0].annotations);
    user.weather.latitude = latitude;
    user.weather.longitude = longitude;
    return user;

};



export async function getWeather(user, maxAttempts = 3, delayMs = 10000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${user.weather.latitude}&longitude=${user.weather.longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`);
            const result = await response.json();
            user.weather.condition = utils.getWeatherDescription(result.current.weather_code);
            user.weather.temperature = result.current.temperature_2m;
            user.weather.humidity = result.current.relative_humidity_2m;
            return user;
        } catch (error) {
            console.warn(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt < maxAttempts) {
                await delay(delayMs);
            }
            else {
                throw new Error(`Failed to fetch weather data after ${maxAttempts} attempts`);
            }

        }
    }
};


export async function updateWeatherData(latitude, longitude) {
    const request = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`);
    const result = await request.json();
    let weatherCondition = utils.getWeatherDescription(result.current.weather_code);
    let temperature = result.current.temperature_2m;
    let humidity = result.current.relative_humidity_2m;
    return { weatherCondition, temperature, humidity };
}






    
