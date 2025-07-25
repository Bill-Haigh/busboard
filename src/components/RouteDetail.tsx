import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRouteDetails } from "../../backend/fetchArrivals";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ArrivalCard from "./ArrivalCard";
import { formatTime } from "../../backend/utils";
import { Button } from "./ui/button";

const RouteDetail = () => {
  const { vehicleId } = useParams();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getDetails() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRouteDetails(vehicleId as string);
      setDetails(data);
    } catch (err) {
      setError("Failed to fetch route details.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getDetails();
  }, [vehicleId]);

  return (
    <main className="bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold underline text-center text-gray-700 m-4">
        Route Details.
      </h1>
      <div className="flex max-w-sm items-center gap-x-2 justify-center mb-4 mx-auto">
        <Button
          className="w-[100px] h-[40px] bg-gray-700 text-white hover:bg-gray-500 rounded-lg font-semibold shadow cursor-pointer"
          onClick={() => getDetails()}
          aria-label="Refresh route details"
        >
          Refresh
        </Button>
        <Link to="/" className="inline-block">
          <button
            type="button"
            className="w-[100px] h-[40px] bg-gray-700 text-white hover:bg-gray-500 rounded-lg font-semibold shadow cursor-pointer"
            aria-label="Return to Home"
          >
            Return
          </button>
        </Link>
      </div>
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
      {!loading && !error && details && (
        <div className="flex flex-row flex-wrap gap-4 justify-center items-start mt-8">
          <div className="flex flex-col gap-2 border border-gray-400 rounded-lg p-4 w-[360px] bg-white shadow">
            {details.map((arrival: any) => (
              <ArrivalCard
                key={arrival.destinationName + arrival.timeToStation} //TODO sort out keys
                arrival={arrival}
                formatTime={formatTime}
                isLink={false}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default RouteDetail;
