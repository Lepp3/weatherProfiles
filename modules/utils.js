
// string formatting
function getWeatherDescription(code) {
    return codesMap[code] || 'Unknown Weather Code';
}


function extractLatAndLong(annotations) {
    const latitude = annotations.DMS.lat.split(' ')[2].slice(0, 5);
    const longitude = annotations.DMS.lng.split(' ')[2].slice(0, 5);
    return [latitude, longitude];
}


// local storage manipulation

function getCachedData() {
    const cachedData = localStorage.getItem('users');
    return cachedData ? JSON.parse(cachedData) : null;
}

function setCachedData(userInfo) {
    localStorage.setItem('users', JSON.stringify(userInfo));
}

export default {
    getWeatherDescription,
    extractLatAndLong,
    getCachedData,
    setCachedData,
    

};
