import { extractLatAndLong } from "./utils.js";
import { API_KEY, GEO_API_URL } from '../constants.js';
import { apiFetch } from "./api.js";


export async function getGeoInformation(user) {
    let queryParam = `?q=${user.location.streetName}+${user.location.streetNumber}%2C+${user.location.zipcode}+${user.location.city}%2C+${user.location.country}&key=${API_KEY}`;
    const url = `${GEO_API_URL}${queryParam}`;
    try {
        const result = await apiFetch(url);
        const [latitude, longitude] = extractLatAndLong(result.results[0].annotations);
        user.weather.latitude = latitude;
        user.weather.longitude = longitude;
        return user;
    } catch (error) {
        console.error("Error fetching geo information: " + error.message);
        return
    }
};