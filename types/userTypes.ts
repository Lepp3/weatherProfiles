import { Weather } from "./weatherTypes.js"

export type User = {
    firstName:string,
    lastName:string,
    userImage:string,
    city:string,
    country:string,
    weather?:Weather
}


export type BaseUser = Omit<User,"weather"> & {
  streetName: string,
  streetNumber: number,
  zipcode: number,
}
