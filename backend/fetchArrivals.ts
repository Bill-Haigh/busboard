const API_KEY = import.meta.env.VITE_TFL_API_KEY;

export async function fetchArrivals(stopcode:string) {
    try {
        const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopcode}/Arrivals?app_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const processedArrivals = await Promise.all(
            data.map((bus: any)=> {
                return {stationName: bus.stationName, destinationName: bus.destinationName, expectedArrival: bus.expectedArrival, lineName: bus.lineName, timeToStation: bus.timeToStation, vehicleId: bus.vehicleId};
            }))
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
        const location = {longitude: data.result.longitude, latitude: data.result.latitude};
        return location;
    } catch (error) {
        console.error('Error fetching postcode:', error);
    }
}

export async function fetchStopsByPostcode(postcode: string, radius: string) {
    try {
        const location = await fetchPostcode(postcode);
        if (!location) {
            throw new Error('Location not found');
        }
        
        const response = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${location.latitude}&lon=${location.longitude}&stopTypes=NaptanPublicBusCoachTram&radius=${radius}&app_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const stops = data.stopPoints.map((stop: any) => {
            return stop.naptanId
        });
        return stops;
    } catch (error) {
        console.error('Error fetching stops by postcode:', error);
    }
}

export async function fetchRouteDetails(vehicleId: string) {
    try {
        const response = await fetch(`https://api.tfl.gov.uk/Vehicle/${vehicleId}/Arrivals?app_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const processedDetails = data.map((detail: any) => {
            return {
                stationName: detail.destinationName,
                destinationName: detail.stationName,
                expectedArrival: detail.expectedArrival,
                lineName: detail.lineName,
                timeToStation: detail.timeToStation,
                vehicleId: detail.vehicleId
            };
        });
        return processedDetails;
    } catch (error) {
        console.error('Error fetching route details:', error);
    }
}