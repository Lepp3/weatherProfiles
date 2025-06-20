import { CODESMAP} from '../constants.js';
import { WeatherCode, WeatherDescription } from '../types/utilityTypes.js';
import { User } from '../types/userTypes.js';
import { LatitudeAndLongitude } from '../types/weatherTypes.js';
import { type Annotations } from '../types/apiValidation.js';


// string formatting
export function getWeatherDescription(code:WeatherCode):WeatherDescription{
  return CODESMAP[code] || 'Unknown Weather Code';
}

export function extractLatAndLong(annotationsObj:Annotations):LatitudeAndLongitude {
  const latitude = annotationsObj.annotations.DMS.lat.split(' ')[2].slice(0, 5);
  const longitude = annotationsObj.annotations.DMS.lng.split(' ')[2].slice(0, 5);
  return {latitude, longitude};
}

// local storage manipulation

export function getCachedData(key:string): User[] | null {
  const cachedData = localStorage.getItem(key);
  return cachedData ? JSON.parse(cachedData) : null;
}

export function setCachedData({key, data}:{key:string,data:User[]}): void{
  localStorage.setItem(key, JSON.stringify(data));
}

export function clearCachedData(key:string):void {
  localStorage.removeItem(key);
}
