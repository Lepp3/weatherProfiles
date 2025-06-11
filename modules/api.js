import { API_KEY } from '../config.js';
import utils from './utils.js';




   async function getFiveUsers(){
    const request = await fetch('https://randomuser.me/api/?results=5&inc=gender,name,nat,picture,location&noinfo');
    const results = await request.json();
    let userArr = [];
    results.results.forEach(user => {
        userArr.push(utils.composeUserObject(user));
    });
    return userArr;
    };


    async function getGeoInformation(user){
        const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${user.location.streetName}+${user.location.streetNumber}%2C+${user.location.zipcode}+${user.location.city}%2C+${user.location.country}&key=${API_KEY}`);
        const result = await request.json();
        const [latitude,longitude] = utils.extractLatAndLong(result.results[0].annotations);
        user.weather.latitude = latitude;
        user.weather.longitude = longitude;
        return user;

    };

    async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWeather(user, maxAttempts = 3, delayMs = 10000) {
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
            else{
                throw new Error(`Failed to fetch weather data after ${maxAttempts} attempts`);
            }

        }
    }
};


    async function updateWeatherData(latitude, longitude){
        const request = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`);
        const result = await request.json();
        let weatherCondition = utils.getWeatherDescription(result.current.weather_code);
        let temperature = result.current.temperature_2m;
        let humidity = result.current.relative_humidity_2m;
        return {weatherCondition, temperature, humidity};
    }


    export default{
        getFiveUsers,
        getGeoInformation,
        getWeather 
        , updateWeatherData
    }
    
    
