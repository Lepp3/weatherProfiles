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


    async function getWeather(user){
        const request = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${user.weather.latitude}&longitude=${user.weather.longitude}&current=weather_code&current=temperature_2m&current=relative_humidity_2m`);
        const result = await request.json();
        user.weather.condition = utils.getWeatherDescription(result.current.weather_code);
        user.weather.temperature = result.current.temperature_2m;
        user.weather.humidity = result.current.relative_humidity_2m;
        return user;

    };


    export default{
        getFiveUsers,
        getGeoInformation,
        getWeather
    }
    
    
