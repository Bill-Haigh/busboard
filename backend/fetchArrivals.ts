export async function fetchArrivals(stopcode:string) {
    try {
        const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopcode}/Arrivals?app_key=5d5ebbce60f9408d9116c189191fe788`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched arrivals:', data);
        const processedArrivals = await Promise.all(
            data.map((bus: any)=> {
            return {destinationName: bus.destinationName, expectedArrival: bus.expectedArrival, lineName: bus.lineName, timeToStation: bus.timeToStation}
        }))
        console.log('Processed arrivals:', processedArrivals);
        return processedArrivals;
    } catch (error) {
        console.error('Error fetching arrivals:', error);
    }
}

export async function fetchPostcode(postcode: string) {
    try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched postcode:', data);
        const location = {longitude: data.result.longitude, latitude: data.result.latitude};
        return location;
    } catch (error) {
        console.error('Error fetching postcode:', error);
    }
}

export async function fetchStopsByPostcode(postcode: string) {
    try {
        const location = await fetchPostcode(postcode);
        if (!location) {
            throw new Error('Location not found');
        }
        
        const response = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${location.latitude}&lon=${location.longitude}&stopTypes=NaptanPublicBusCoachTram&app_key=5d5ebbce60f9408d9116c189191fe788`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched stops by postcode:', data);
        const stops = data.stopPoints.map((stop: any) => {
            return stop.naptanId
        });
        console.log('Processed stops:', stops);
        return stops;
    } catch (error) {
        console.error('Error fetching stops by postcode:', error);
    }
}