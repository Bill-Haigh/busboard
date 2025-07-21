import { useState } from 'react';
import fetchArrivals from '../backend/fetchArrivals';

interface Arrival {
  lineName: string;
  destinationName: string;
  expectedArrival: string;
  timeToStation: number;
}


function App() {
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [stopcode, setStopcode] = useState('');

  async function fetchArrivalsFromAPI(stopcode: string) {
    const data: any = await fetchArrivals(stopcode);
    setArrivals(data)
  }

  return (
        <div>
          <h1 className="text-3xl font-bold underline text-center text-cyan-600 m-4">BusBoard</h1>
          <input
            type="text"
            placeholder="Enter Stop Code"
            onChange={(e) => setStopcode(e.target.value)}
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          />
          <button className='border border-gray-300 rounded p-2 mb-4 w-full' onClick={() => fetchArrivalsFromAPI(stopcode)}>Fetch Arrivals</button>
          <div>
            {arrivals ? (arrivals.length > 5 ? arrivals.slice(4).map((bus: Arrival) => {
              return (
                <div key={bus.lineName} className="border border-gray-300 rounded p-2 mb-4">
                  <h2 className="text-xl font-semibold">{bus.lineName}</h2>
                  <p>Destination: {bus.destinationName}</p>
                  <p>Expected Arrival: {new Date(bus.expectedArrival).toLocaleTimeString()}</p>
                  <p>Time to Station: {bus.timeToStation} seconds</p>
                </div>
              );
            }) : arrivals.map((bus: Arrival) => {
              return (
                <div key={bus.lineName} className="border border-gray-300 rounded p-2 mb-4">
                  <h2 className="text-xl font-semibold">{bus.lineName}</h2>
                  <p>Destination: {bus.destinationName}</p>
                  <p>Expected Arrival: {new Date(bus.expectedArrival).toLocaleTimeString()}</p>
                  <p>Time to Station: {bus.timeToStation} seconds</p>
                </div>
              );
            })) : 'No arrivals data available.'}
          </div>
        </div>
  )
}

export default App
