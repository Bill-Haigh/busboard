import { useEffect, useState } from "react";
import {
  fetchArrivals,
  fetchPostcode,
  fetchStopsByPostcode,
} from "../backend/fetchArrivals";

interface Arrival {
  lineName: string;
  destinationName: string;
  expectedArrival: string;
  timeToStation: number;
}

function App() {
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [stopcodes, setStopcodes] = useState([]);
  const [postcode, setPostcode] = useState("");

  async function fetchArrivalsFromAPI(postcode: string) {
    const stops: any = await fetchStopsByPostcode(postcode);
    setStopcodes(stops);
    const data = await Promise.all(
      stops.map(async (stopcode: string) => {
        return await fetchArrivals(stopcode);
      })
    );
    console.log("this is arrivals", data);
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
      <div>
        {arrivals.map((stop) => {
          return (
            <div>
              {stop.length > 0
                ? stop.length > 5
                  ? stop.slice(4).map((bus: Arrival) => {
                      return (
                        <div
                          key={bus.lineName}
                          className="border border-gray-300 rounded p-2 mb-4"
                        >
                          <h2 className="text-xl font-semibold">
                            {bus.lineName}
                          </h2>
                          <p>Destination: {bus.destinationName}</p>
                          <p>
                            Expected Arrival:{" "}
                            {new Date(bus.expectedArrival).toLocaleTimeString()}
                          </p>
                          <p>Time to Station: {bus.timeToStation} seconds</p>
                        </div>
                      );
                    })
                  : stop.map((bus: Arrival) => {
                      return (
                        <div
                          key={bus.lineName}
                          className="border border-gray-300 rounded p-2 mb-4"
                        >
                          <h2 className="text-xl font-semibold">
                            {bus.lineName}
                          </h2>
                          <p>Destination: {bus.destinationName}</p>
                          <p>
                            Expected Arrival:{" "}
                            {new Date(bus.expectedArrival).toLocaleTimeString()}
                          </p>
                          <p>Time to Station: {bus.timeToStation} seconds</p>
                        </div>
                      );
                    })
                : "No arrivals data available."}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
