import { USER_API_URL } from "../constants.js";
import { apiFetch } from "./api.js";
import { composeUserObject } from "./utils.js";


export async function buildUserInfo(users) {
  const completeUsers = await Promise.all(
    users.map(async user => {
      const withGeoInfo = await api.getGeoInformation(user);
      const withWeatherInfo = await api.getWeather(withGeoInfo);
      return withWeatherInfo;
    })
  );
  return completeUsers;
}

export function composeUserObject(user) {
    let userObj = {
        location: {},
        weather: {},
    };
    userObj.firstName = user.name.first;
    userObj.lastName = user.name.last;
    userObj.userImage = user.picture.medium;
    userObj.location.streetNumber = user.location.street.number;
    userObj.location.streetName = user.location.street.name;
    userObj.location.zipcode = user.location.postcode;
    userObj.location.city = user.location.city;
    userObj.location.country = user.location.country;
    return userObj;
}

export async function getFiveUsers() {
  try{
    const results = await apiFetch(USER_API_URL);
    let userArr = [];
    results.results.forEach(user => {
        userArr.push(composeUserObject(user));
    });
    return userArr;
  }catch (error){
    console.error("Error fetching users: " + error.message);
    return [];
  }
    
};
