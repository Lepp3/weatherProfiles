import { CODESMAP } from "../constants.js";

export type Annotations = {
  DMS: {
    lat: string;
    lng: string;
  };
};


export type DMSCoordinates = {
  results: {
    annotations: Annotations;
  }[];
};

export type WeatherCode = keyof typeof CODESMAP;
export type WeatherDescription = typeof CODESMAP[WeatherCode];