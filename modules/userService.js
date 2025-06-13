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
  const {
    name: { first: firstName, last: lastName },
    picture: { medium: userImage },
    location: {
      street: { number: streetNumber, name: streetName },
      postcode: zipcode,
      city,
      country,
    },
  } = user;

  return {
    firstName,
    lastName,
    userImage,
    streetNumber,
    streetName,
    zipcode,
    city,
    country,
  };
}

export async function buildUserInfo(users) {
  const completeUsers = await Promise.all(
    users.map(async (user) => {
      const { latitude, longitude } = await getGeoInformation(
        user.streetName,
        user.streetNumber,
        user.zipcode,
        user.city,
        user.country
      );

      const { condition, temperature, humidity } = await getWeather(
        latitude,
        longitude
      );

      const weather = { latitude, longitude, condition, temperature, humidity };

      const {
        streetName: _,
        streetNumber: __,
        zipcode: ___,
        ...finalUserObject
      } = user;

      return {
        ...finalUserObject,
        weather,
      };
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
