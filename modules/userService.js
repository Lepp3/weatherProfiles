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
