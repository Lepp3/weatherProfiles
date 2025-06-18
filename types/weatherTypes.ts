export type LatitudeAndLongitude = {
    latitude?:string,
    longitude?:string
}

export type WeatherConditions = {
    condition?:string,
    temperature?:number,
    humidity?: number
}

export type Weather = LatitudeAndLongitude & WeatherConditions;