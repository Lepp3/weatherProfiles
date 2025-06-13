import { USER_API_URL } from '../constants.js';
import { apiFetch } from './api.js';
import { getGeoInformation } from './geoService.js';
import { getCachedData, setCachedData } from './utils.js';
import { getWeather } from './weatherService.js';

export async function fetchFiveNewUsers() {
  try {
    const fetchedUsers = await apiFetch(USER_API_URL);
    let userArr = [];
    fetchedUsers.results.forEach((user) => {
      userArr.push(composeUserObject(user));
    });
    return userArr;
  } catch (error) {
    console.error('Error fetching users: ' + error.message);
    return;
  }
}

export function composeUserObject(user) {
  const userObj = {
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

export async function buildUserInfo(users) {
  const completeUsers = await Promise.all(
    users.map(async (user) => {
      const withGeoInfo = await getGeoInformation(user);
      const withWeatherInfo = await getWeather(withGeoInfo);
      return withWeatherInfo;
    })
  );
  return completeUsers;
}

export async function getUsers() {
  const cachedUsers = getCachedData('users');
  if (cachedUsers) {
    return cachedUsers;
  } else {
    try {
      const baseUsers = await fetchFiveNewUsers();
      const completeUsers = await buildUserInfo(baseUsers);
      setCachedData('users', completeUsers);
      return completeUsers;
    } catch (error) {
      console.warn('Could not fetch new users');
      return null;
    }
  }
}
