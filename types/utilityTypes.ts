import { CODESMAP } from '../constants.js';

export type WeatherCode = keyof typeof CODESMAP;
export type WeatherDescription = (typeof CODESMAP)[WeatherCode];
