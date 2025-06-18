import { LatitudeAndLongitude, WeatherConditions } from "./weatherTypes.js"

export type User = {
    firstName:string,
    lastName:string,
    userImage:string,
    city:string,
    nationality:string,
    country:string,
    coordinates?: LatitudeAndLongitude,
    weather?:WeatherConditions
}


export type BaseUser = Omit<User,"weather"> & {
  streetName: string,
  streetNumber: number,
  zipcode: number,
}
