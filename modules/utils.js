const codesMap = {
    '0': 'Clear Sky',
    '1': 'Mainly Clear',
    '2': 'Partly Cloudy',
    '3': 'Overcast',
    '45': 'Fog',
    '48': 'Depositing Rime Fog',
    '51': 'Light Drizzle',
    '53': 'Drizzle',
    '55': 'Dense Drizzle',
    '56': 'Light Freezing Drizzle',
    '57': 'Dense Freezing Drizzle',
    '61': 'Slight Rain',
    '63': 'Rain',
    '65': 'Heavy Rain',
    '66': 'Light Freezing Rain',
    '67': 'Heavy Freezing Rain',
    '71': 'Slight Snow Fall',
    '73': 'Snow Fall',  
    '75': 'Heavy Snow Fall',
    '77': 'Snow Grains',
    '80': 'Slight Rain Showers',
    '81': 'Moderate Rain Showers',
    '82': 'Violent Rain Showers',
    '85': 'Slight Snow Showers',
    '86': 'Heavy Snow Showers',
    '95': 'Slight or Moderate Thunderstorm',
    '96': 'Thunderstorm with Slight Hail',
    '99': 'Thunderstorm with Heavy Hail',
}

function getWeatherDescription(code) {
    return codesMap[code] || 'Unknown Weather Code';
}


function extractLatAndLong(annotations){
    const latitude = annotations.DMS.lat.split(' ')[2].slice(0,5);
    const longitude = annotations.DMS.lng.split(' ')[2].slice(0,5);
    return [latitude, longitude];
}

function composeUserObject(user){
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

function getCachedData(){
    const cachedData = localStorage.getItem('users');
    return cachedData ? JSON.parse(cachedData) : null;
}

function setCachedData(userInfo){
    localStorage.setItem('users', JSON.stringify(userInfo));
}

export default {
    getWeatherDescription,
    extractLatAndLong,
    getCachedData,
    setCachedData,
    composeUserObject
    
};
