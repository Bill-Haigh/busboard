import { useState } from "react";
import {
  fetchArrivals,
  fetchStopsByPostcode,
} from "../../backend/fetchArrivals";
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
import ArrivalCard from "./ArrivalCard";
import type { Arrival } from "./ArrivalCard";
import { formatTime } from "../../backend/utils"; // Assuming formatTime is exported from utils

// Arrival interface now imported from ArrivalCard

const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

function BusBoard() {
  const [arrivals, setArrivals] = useState<Arrival[][]>([]);
  const [postcode, setPostcode] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [radius, setRadius] = useState(500);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchArrivalsFromAPI(postcode: string) {
    setShowAlert(false);
    setError(null);
    setLoading(true);
    try {
      if (!postcodeRegex.test(postcode)) {
        setShowAlert(true);
        setLoading(false);
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
    } catch (err) {
      setError("Failed to fetch arrivals. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="bg-gray-100 min-h-screen"
      aria-label="BusBoard main content"
    >
      <h1
        className="text-3xl font-bold underline text-center text-gray-700 m-4"
        id="busboard-title"
      >
        BusBoard
      </h1>
      <section
        className="flex flex-col items-center w-full mb-4"
        aria-labelledby="busboard-title"
      >
        <form
          className="flex w-full max-w-sm items-center gap-x-2 justify-center"
          role="search"
          aria-label="Search for bus stops by postcode"
          onSubmit={(e) => {
            e.preventDefault();
            fetchArrivalsFromAPI(postcode);
          }}
        >
          <Input
            type="text"
            placeholder="Enter Post Code"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.replace(" ", ""))}
            className="w-full h-[40px] max-w-sm bg-white border-gray-300 text-gray-700 rounded-lg px-2 py-2 shadow"
            aria-label="Postcode input"
            aria-describedby="postcode-desc"
            autoComplete="postal-code"
          />
          <Button
            className="w-[100px] h-[40px] bg-gray-700 text-white hover:bg-gray-500 rounded-lg font-semibold shadow cursor-pointer"
            onClick={() => fetchArrivalsFromAPI(postcode)}
            aria-label={
              arrivals.length > 0 ? "Refresh bus arrivals" : "Submit postcode"
            }
            type="submit"
          >
            {arrivals.length > 0 ? "Refresh" : "Submit"}
          </Button>
        </form>
        <span id="postcode-desc" className="sr-only">
          Enter a valid UK postcode to search for bus stops.
        </span>
        <div className="flex w-full max-w-sm items-center gap-x-2 justify-center mt-4">
          <Slider
            defaultValue={[radius]}
            max={1000}
            step={10}
            className="w-full max-w-sm bg-white border border-gray-300 rounded-lg px-2 py-4 shadow"
            onValueChange={(value: number[]) => setRadius(value[0])}
            aria-label="Search radius slider"
          />
          <p
            className="w-[100px] h-[40px] flex items-center justify-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-semibold shadow"
            style={{ minWidth: "100px", minHeight: "40px" }}
            aria-live="polite"
            aria-atomic="true"
          >
            {radius} m
          </p>
        </div>
        {showAlert && (
          <Alert
            variant="destructive"
            className="mt-4 max-w-sm mx-auto bg-gray-200 border-gray-400 text-gray-800"
            role="alert"
            aria-live="assertive"
          >
            <AlertTitle>Invalid Postcode</AlertTitle>
            <AlertDescription>
              Please enter a valid UK postcode before fetching arrivals.
            </AlertDescription>
          </Alert>
        )}
      </section>
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <svg
            className="animate-spin h-8 w-8 text-gray-700 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-gray-600 font-semibold">Loading...</span>
        </div>
      )}
      {error && (
        <Alert
          variant="destructive"
          className="mt-4 max-w-sm mx-auto bg-gray-200 border-gray-400 text-gray-800"
        >
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!loading && !error && (
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
                      {stop
                        .slice()
                        .sort((a, b) => a.timeToStation - b.timeToStation)
                        .slice(0, 5)
                        .map((bus: Arrival, busIdx: number) => (
                          <ArrivalCard
                            key={bus.lineName + busIdx}
                            arrival={bus}
                            formatTime={formatTime}
                            isLink={true}
                          />
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
      )}
    </main>
  );
}

export default BusBoard;
