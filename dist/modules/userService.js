import { USER_API_URL } from '../constants.js';
import { apiFetch } from './api.js';
import { getGeoInformation } from './geoService.js';
import { getCachedData, setCachedData } from './utils.js';
import { getWeather } from './weatherService.js';
export async function fetchFiveNewUsers() {
    try {
        const fetchedUsers = await apiFetch(USER_API_URL);
        const userArr = [];
        fetchedUsers.results.forEach((user) => {
            userArr.push(composeUserObject(user));
        });
        console.log("BASE USER ARRAY", userArr);
        return userArr;
    }
    catch (error) {
        error instanceof Error ? console.error('Error fetching users: ' + error.message) : console.error('Error fetching users: ' + String(error));
        return null;
    }
}
function composeUserObject(user) {
    return {
        firstName: user.name.first,
        lastName: user.name.last,
        userImage: user.picture.medium,
        streetNumber: user.location.street.number,
        streetName: user.location.street.name,
        zipcode: user.location.postcode,
        city: user.location.city,
        country: user.location.country,
    };
}
async function buildUserInfo(users) {
    const completeUsers = await Promise.all(users.map(async (user) => {
        const geoInfo = await getGeoInformation({ streetName: user.streetName,
            streetNumber: user.streetNumber,
            zipcode: user.zipcode,
            city: user.city,
            country: user.country });
        const weatherConditions = geoInfo ? await getWeather(geoInfo) : null;
        const weather = {
            latitude: geoInfo?.latitude,
            longitude: geoInfo?.longitude,
            condition: weatherConditions?.condition,
            temperature: weatherConditions?.temperature,
            humidity: weatherConditions?.humidity
        };
        if (!weatherConditions && geoInfo) {
            return {
                firstName: user.firstName,
                lastName: user.lastName,
                country: user.country,
                city: user.city,
                userImage: user.userImage,
                weather: { ...geoInfo }
            };
        }
        if (!geoInfo && !weatherConditions) {
            return {
                firstName: user.firstName,
                lastName: user.lastName,
                country: user.country,
                city: user.city,
                userImage: user.userImage,
            };
        }
        const { streetName: _, streetNumber: __, zipcode: ___, ...finalUserObject } = user;
        return {
            ...finalUserObject,
            weather
        };
    }));
    return completeUsers;
}
export async function getUsers() {
    const cachedUsers = getCachedData('users');
    if (cachedUsers) {
        return cachedUsers;
    }
    else {
        try {
            const baseUsers = await fetchFiveNewUsers();
            console.log("FROM GET USERS BASE USERS", baseUsers);
            const completeUsers = baseUsers ? await buildUserInfo(baseUsers) : null;
            if (!completeUsers) {
                return null;
            }
            console.log("COMPLETE USERS FROM GET USERS", completeUsers);
            setCachedData({ key: 'users', data: completeUsers });
            return completeUsers;
        }
        catch (error) {
            console.warn('Could not fetch new users');
            return null;
        }
    }
}
