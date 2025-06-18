import { extractLatAndLong } from './utils.js';
import { API_KEY, GEO_API_URL } from '../constants.js';
import { apiFetch } from './api.js';
export async function getGeoInformation({ streetName, streetNumber, zipcode, city, country }) {
    const queryParam = `?q=${encodeURIComponent(`${streetName} ${streetNumber}, ${zipcode} ${city}, ${country}`)}&key=${API_KEY}`;
    const url = `${GEO_API_URL}${queryParam}`;
    try {
        const result = await apiFetch(url);
        const { latitude, longitude } = extractLatAndLong(result.results[0].annotations);
        return { latitude, longitude };
    }
    catch (error) {
        error instanceof Error ? console.error('Error fetching geo information: ' + error.message) : console.error('Error fetching geo information: ' + String(error));
        return null;
    }
}
