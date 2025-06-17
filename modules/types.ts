
export type User = {
    firstName:string,
    lastName:string,
    userImage:string,
    city:string,
    country:string,
    weather:Weather

}

export type LatitudeAndLongitude = {
    latitude?:string,
    longitude?:string
}

export type WeatherConditions = {
    condition:string,
    temperature:number,
    humidity: number
}

export type Weather = LatitudeAndLongitude & WeatherConditions;

export type WeatherResponseApi = {
  current: {
    time: string;
    interval: number;
    weather_code: number;
    temperature_2m: number;
    relative_humidity_2m: number;
  };
};

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