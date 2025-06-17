export async function apiFetch<T>(url:string, maxAttempts = 3, delayMs = 1000):Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as T;
    } catch (error) {
      if(error instanceof Error){
      console.warn(`Attempt ${attempt} failed: ${error.message}`);
      }else{
        console.warn(String(error));
      }
      if (attempt < maxAttempts) {
        await delay(delayMs);
      } 
  
      
    }
  }
  throw new Error(`Failed to fetch data after ${maxAttempts} attempts`);
}

async function delay(ms:number):Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
