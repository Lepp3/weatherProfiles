import { API_KEY } from '../config.js';




   async function getFiveUsers(){
    const request = await fetch('https://randomuser.me/api/?results=5&inc=gender,name,nat,picture,location&noinfo');
    return request.json();
    };


    async function getLatAndLong(streetName,streetNumber,zipcode,city,country){
        const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${streetName}+${streetNumber}%2C+${zipcode}+${city}%2C+${country}&key=${API_KEY}`);
        const result = await request.json();

        return result;

    };


    async function getWeather(latitude,longitude){
        const request = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`);
        const result = await request.json();
        const weatherCode = result.results.current.weather_code;
        const temperature = result.results.current.temperature_2m;
        const humidity = result.results.current.relative_humidity_2m;
        return {
            weatherCode,
            temperature,
            humidity
        };
    }


    export default{
        getFiveUsers,
        getLatAndLong,
        getWeather
    }
    
    
