export type ApiResponseUser = {
  name: {
    first: string,
    last: string,
  },
  location: {
    street:{
      number: number,
      name: string
    },
    city: string,
    country: string,
    postcode: number,
  },
  picture: {
    medium: string,
  }

}

export type ApiResponseUserWrapper = {
  results: ApiResponseUser[]
}



export type WeatherResponseApi = {
  current: {
    time: string;
    interval: number;
    weather_code: number;
    temperature_2m: number;
    relative_humidity_2m: number;
  };
};