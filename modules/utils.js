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

function extractLocationInfo(location) {
    const streetName = location.street.name;
    const streetNumber = location.street.number;
    const zipcode = location.postcode;
    const city = location.city;
    const country = location.country;
    return [streetName, streetNumber, zipcode, city, country];
}

function extractLatAndLong(annotations){
    const latitude = annotations.DMS.lat.split(' ')[2].slice(0,5);
    const longitude = annotations.DMS.lng.split(' ')[2].slice(0,5);
    return [latitude, longitude];
}



export default {
    getWeatherDescription,
    extractLocationInfo,
    extractLatAndLong,
    makeLocalStorageLocationKey
};
