import { useState } from 'react';
import fetchArrivals from '../backend/fetchArrivals';

function App() {
  const [arrivals, setArrivals] = useState('');
  const [stopcode, setStopcode] = useState('');

  async function fetchArrivalsFromAPI(stopcode: string) {
    const data: string = await fetchArrivals(stopcode);
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
            {arrivals ? arrivals : 'No arrivals data available.'}
          </div>
        </div>
  )
}

export default App
