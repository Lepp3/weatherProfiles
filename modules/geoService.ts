import { extractLatAndLong } from './utils.js';
import { API_KEY, GEO_API_URL } from '../constants.js';
import { apiFetch } from './api.js';
import { GeoApiResponseSchema, type GeoApiResponse } from '../types/apiValidation.js';
import { LatitudeAndLongitude } from '../types/weatherTypes.js';

export async function getGeoInformation({
  city,
  country}:{
    city:string,
    country:string
  }
):Promise<LatitudeAndLongitude | null> {
  const queryParam = `?q=${encodeURIComponent(
    `${city}, ${country}`
  )}&key=${API_KEY}`;
  const url = `${GEO_API_URL}${queryParam}`;
  let rawData
  try {
    rawData = await apiFetch(url);
    const geoApiResponse = GeoApiResponseSchema.safeParse(rawData);
    if(!geoApiResponse.success){
      console.error(geoApiResponse.error.format());
      return null
    }
   
    const { latitude, longitude } = extractLatAndLong(
      geoApiResponse.data.results[0]
    );

    

    return { latitude, longitude };
  } catch (error) {
    error instanceof Error ? console.error('Error fetching geo information: ' + error.message) : console.error('Error fetching geo information: ' + String(error))
    ;
    return null;
  }
}
