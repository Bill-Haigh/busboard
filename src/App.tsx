import { useState } from "react";
import { fetchArrivals, fetchStopsByPostcode } from "../backend/fetchArrivals";

interface Arrival {
  lineName: string;
  destinationName: string;
  expectedArrival: string;
  timeToStation: number;
}

function App() {
  const [arrivals, setArrivals] = useState<Arrival[][]>([]);
  const [postcode, setPostcode] = useState("");

  async function fetchArrivalsFromAPI(postcode: string) {
    const stops: string[] = await fetchStopsByPostcode(postcode);
    const data = (
      await Promise.all(
        stops.map(async (stopcode: string) => {
          return await fetchArrivals(stopcode);
        })
      )
    ).filter((arr): arr is Arrival[] => Array.isArray(arr));
    console.log("Fetched data for all stops:", data);
    setArrivals(data);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center text-cyan-600 m-4">
        BusBoard
      </h1>
      <input
        type="text"
        placeholder="Enter Post Code"
        onChange={(e) => setPostcode(e.target.value.replace(" ", ""))}
        className="border border-gray-300 rounded p-2 mb-4 w-full"
      />
      <button
        className="border border-gray-300 rounded p-2 mb-4 w-full"
        onClick={() => fetchArrivalsFromAPI(postcode)}
      >
        Fetch Arrivals
      </button>
      <div className="flex flex-row flex-wrap gap-4 justify-center items-start mt-8">
        {arrivals.map((stop, stopIdx) => (
          <div
            key={stopIdx}
            className="flex flex-col gap-2 border border-cyan-400 rounded-lg p-4 min-w-[300px] bg-white shadow"
          >
            <h2 className="text-lg font-bold text-cyan-700 mb-2">
              Stop {stopIdx + 1}
            </h2>
            {stop.length > 0 ? (
              stop.slice(0, 5).map((bus: Arrival, busIdx: number) => (
                <div
                  key={bus.lineName + busIdx}
                  className="border border-gray-300 rounded p-2 mb-2 bg-gray-50"
                >
                  <h3 className="text-md font-semibold">{bus.lineName}</h3>
                  <p>Destination: {bus.destinationName}</p>
                  <p>
                    Expected Arrival:{" "}
                    {new Date(bus.expectedArrival).toLocaleTimeString()}
                  </p>
                  <p>Time to Station: {bus.timeToStation} seconds</p>
                </div>
              ))
            ) : (
              <span className="text-gray-400">No arrivals data available.</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
