import { useState } from "react";
import { fetchArrivals, fetchStopsByPostcode } from "../backend/fetchArrivals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface Arrival {
  stationName: string;
  lineName: string;
  destinationName: string;
  expectedArrival: string;
  timeToStation: number;
}

const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

function App() {
  const [arrivals, setArrivals] = useState<Arrival[][]>([]);
  const [postcode, setPostcode] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  async function fetchArrivalsFromAPI(postcode: string) {
    setShowAlert(false);
    if (!postcodeRegex.test(postcode)) {
      setShowAlert(true);
      return;
    }
    const stops: string[] = await fetchStopsByPostcode(postcode);
    const results = await Promise.all(
      stops.map(async (stopcode: string) => {
        return await fetchArrivals(stopcode);
      })
    );
    const data = results.filter(
      (arr): arr is Arrival[] =>
        Array.isArray(arr) &&
        arr.length > 0 &&
        typeof arr[0] === "object" &&
        arr[0] !== null &&
        "stationName" in arr[0]
    );
    setArrivals(data);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-center text-cyan-600 m-4">
        BusBoard
      </h1>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          type="text"
          placeholder="Enter Post Code"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value.replace(" ", ""))}
        />
        <Button onClick={() => fetchArrivalsFromAPI(postcode)}>
          Fetch Arrivals
        </Button>
      </div>
      {showAlert && (
        <Alert variant="destructive" className="mt-4 max-w-sm mx-auto">
          <AlertTitle>Invalid Postcode</AlertTitle>
          <AlertDescription>
            Please enter a valid UK postcode before fetching arrivals.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-row flex-wrap gap-4 justify-center items-start mt-8">
        <Carousel className="w-[360px]">
          <CarouselContent>
            {arrivals
              .filter((stop) => stop.length > 0)
              .map((stop, idx) => (
                <CarouselItem key={`${stop[0].stationName}-${idx}`}>
                  <div className="flex flex-col gap-2 border border-cyan-400 rounded-lg p-4 min-w-[340px] bg-white shadow">
                    <h2 className="text-lg font-bold text-cyan-700 mb-2">
                      {stop[0].stationName}
                    </h2>
                    {stop.slice(0, 5).map((bus: Arrival, busIdx: number) => (
                      <div
                        key={bus.lineName + busIdx}
                        className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow mb-2"
                      >
                        <h3 className="text-md font-semibold mb-1">
                          {bus.lineName}
                        </h3>
                        <p className="mb-1">
                          Destination: {bus.destinationName}
                        </p>
                        <p className="mb-1">
                          Expected Arrival:{" "}
                          {new Date(bus.expectedArrival).toLocaleTimeString()}
                        </p>
                        <p className="mb-1">
                          Time to Station: {bus.timeToStation} seconds
                        </p>
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          {arrivals.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}

export default App;
