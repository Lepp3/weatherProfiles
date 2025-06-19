



export type WeatherResponseApi = {
  current: {
    time: string;
    interval: number;
    weather_code: number;
    temperature_2m: number;
    relative_humidity_2m: number;
  };
};