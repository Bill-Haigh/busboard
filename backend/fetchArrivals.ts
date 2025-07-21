export default async function fetchArrivals(stopcode:string) {
    try {
        const response = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopcode}/Arrivals?app_key=5d5ebbce60f9408d9116c189191fe788`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched arrivals:', data);
        data.map((bus: any)=> {
            return {destinationName: bus.destinationName, expectedArrival: bus.expectedArrival, lineName: bus.lineName, timeToStation: bus.timeToStation}
        })
        return data;
    } catch (error) {
        console.error('Error fetching arrivals:', error);
    }
}

