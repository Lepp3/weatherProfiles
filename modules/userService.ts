import { USER_API_URL } from '../constants.js';
import { apiFetch } from './api.js';
import { getGeoInformation } from './geoService.js';
import { getCachedData, setCachedData } from './utils.js';
import { getWeather } from './weatherService.js';
import {
  ApiResponseUser,
  ApiResponseUserWrapper,
} from '../types/responseTypes.js';
import {
  LatitudeAndLongitude,
  WeatherConditions,
} from '../types/weatherTypes.js';
import { User, BaseUser } from '../types/userTypes.js';

export async function fetchNewUsers({
  nationality,
  neededUsers,
}: { nationality?: string; neededUsers?: number } = {}): Promise<
  BaseUser[] | null
> {
  let queryParam = `?results=5&inc=gender,name,nat,picture,location&noinfo`;
  if (neededUsers && nationality) {
    queryParam = `?results=${neededUsers}&inc=gender,name,picture,location&noinfo&nat=${nationality}`;
  }
  try {
    const fetchedUsers = await apiFetch<Promise<ApiResponseUserWrapper>>(
      USER_API_URL + queryParam
    );
    const userArr: BaseUser[] = [];
    fetchedUsers.results.forEach((user: ApiResponseUser) => {
      if (nationality) {
        userArr.push(composeUserObject({ user, nationality }));
      } else {
        userArr.push(composeUserObject({ user }));
      }
    });
    return userArr;
  } catch (error) {
    error instanceof Error
      ? console.error('Error fetching users: ' + error.message)
      : console.error('Error fetching users: ' + String(error));
    return null;
  }
}

function composeUserObject({
  user,
  nationality,
}: {
  user: ApiResponseUser;
  nationality?: string;
}): BaseUser {
  if (nationality) {
    return {
      fullName: user.name.first + user.name.last,
      image: user.picture.medium,
      city: user.location.city,
      country: user.location.country,
      nationality,
    };
  }
  return {
    fullName: user.name.first + user.name.last,
    image: user.picture.medium,
    city: user.location.city,
    country: user.location.country,
    nationality: user.nat,
  };
}

export async function buildUserInfo(users: BaseUser[]): Promise<User[]> {
  const completeUsers = await Promise.all(
    users.map(async (user: BaseUser) => {
      const geoInfo: LatitudeAndLongitude | null = await getGeoInformation({
        city: user.city,
        country: user.country,
      });

      const weatherConditions: WeatherConditions | null = geoInfo
        ? await getWeather(geoInfo)
        : null;

      if (!weatherConditions && geoInfo) {
        return {
          fullName: user.fullName,
          country: user.country,
          city: user.city,
          image: user.image,
          nationality: user.nationality,
          coordinates: geoInfo,
        };
      }

      if (!geoInfo && !weatherConditions) {
        return {
          fullName: user.fullName,
          country: user.country,
          city: user.city,
          image: user.image,
          nationality: user.nationality,
        };
      }

      const {
        ...finalUserObject
      } = user;

      return {
        ...finalUserObject,
        weather: { ...weatherConditions },
        coordinates: { ...geoInfo },
      };
    })
  );
  return completeUsers;
}

export async function getUsers(): Promise<User[] | null> {
  const cachedUsers = getCachedData('users');
  if (cachedUsers) {
    return cachedUsers;
  } else {
    try {
      const baseUsers = await fetchNewUsers();
      const completeUsers = baseUsers ? await buildUserInfo(baseUsers) : null;
      if (!completeUsers) {
        return null;
      }
      setCachedData({ key: 'users', data: completeUsers });
      return completeUsers;
    } catch (error) {
      console.warn('Could not fetch new users');
      return null;
    }
  }
}
