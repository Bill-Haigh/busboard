import { useEffect, useState } from "react";
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
import { Slider } from "@/components/ui/slider";

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
  const [radius, setRadius] = useState(500);

  async function fetchArrivalsFromAPI(postcode: string) {
    setShowAlert(false);
    if (!postcodeRegex.test(postcode)) {
      setShowAlert(true);
      return;
    }
    const radiusStr = radius.toString();
    const stops: string[] = await fetchStopsByPostcode(postcode, radiusStr);
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

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold underline text-center text-gray-700 m-4">
        BusBoard
      </h1>
      <div className="flex flex-col items-center w-full mb-4">
        <div className="flex w-full max-w-sm items-center gap-2 justify-center">
          <Input
            type="text"
            placeholder="Enter Post Code"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.replace(" ", ""))}
            className="bg-white border-gray-300 text-gray-700"
          />
          <Button
            className="bg-gray-700 text-white hover:bg-gray-800"
            onClick={() => fetchArrivalsFromAPI(postcode)}
          >
            Submit
          </Button>
        </div>
        <Slider
          defaultValue={[500]}
          max={1000}
          step={10}
          className="w-full max-w-sm mt-4"
          onValueChange={(value: number[]) => setRadius(value[0])}
        />
        <p>{radius} meters.</p>
        {showAlert && (
          <Alert
            variant="destructive"
            className="mt-4 max-w-sm mx-auto bg-gray-200 border-gray-400 text-gray-800"
          >
            <AlertTitle>Invalid Postcode</AlertTitle>
            <AlertDescription>
              Please enter a valid UK postcode before fetching arrivals.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex flex-row flex-wrap gap-4 justify-center items-start mt-8">
        <Carousel className="w-[360px]">
          <CarouselContent>
            {arrivals
              .filter((stop) => stop.length > 0)
              .map((stop, idx) => (
                <CarouselItem key={`${stop[0].stationName}-${idx}`}>
                  <div className="flex flex-col gap-2 border border-gray-400 rounded-lg p-4 min-w-[340px] bg-white shadow">
                    <h2 className="text-lg font-bold text-gray-700 mb-2">
                      {stop[0].stationName}
                    </h2>
                    {stop.slice(0, 5).map((bus: Arrival, busIdx: number) => (
                      <div
                        key={bus.lineName + busIdx}
                        className="border border-gray-300 rounded-lg p-4 bg-gray-100 shadow mb-2"
                      >
                        <h3 className="text-md font-semibold mb-1 text-gray-800">
                          {bus.lineName}
                        </h3>
                        <p className="mb-1 text-gray-700">
                          Destination: {bus.destinationName}
                        </p>
                        <p className="mb-1 text-gray-700">
                          Expected Arrival:{" "}
                          {new Date(bus.expectedArrival).toLocaleTimeString()}
                        </p>
                        <p className="mb-1 text-gray-700">
                          Time to Station: {formatTime(bus.timeToStation)}
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
