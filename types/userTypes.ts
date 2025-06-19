import { LatitudeAndLongitude, WeatherConditions } from './weatherTypes.js';

export type BaseUser = {
  fullName: string;
  image: string;
  city: string;
  nationality: string;
  country: string;
};

export type User = BaseUser & {
  coordinates?: LatitudeAndLongitude;
  weather?: WeatherConditions;
};
