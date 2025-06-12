
// string formatting
export function getWeatherDescription(code) {
    return codesMap[code] || 'Unknown Weather Code';
}


export function extractLatAndLong(annotations) {
    const latitude = annotations.DMS.lat.split(' ')[2].slice(0, 5);
    const longitude = annotations.DMS.lng.split(' ')[2].slice(0, 5);
    return [latitude, longitude];
}


// local storage manipulation

export function getCachedData() {
    const cachedData = localStorage.getItem('users');
    return cachedData ? JSON.parse(cachedData) : null;
}

export function setCachedData(userInfo) {
    localStorage.setItem('users', JSON.stringify(userInfo));
}

export function clearCachedData() {
    localStorage.removeItem('users');
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export async function apiFetch(url, maxAttempts = 3, delayMs = 10000) {
    for(let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`Attempt ${attempt} failed: ${error.message}`);
            if (attempt < maxAttempts) {
                await delay(delayMs);
            } else {
                throw new Error(`Failed to fetch data after ${maxAttempts} attempts`);
            }
        }
    }
}



