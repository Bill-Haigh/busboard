import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchRouteDetails } from "../../backend/fetchArrivals";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ArrivalCard from "./ArrivalCard";
import { formatTime } from "../../backend/utils"; // Assuming formatTime is exported from utils

const RouteDetail = () => {
  const { vehicleId } = useParams();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    getDetails();
  }, [vehicleId]);

  return (
    <main className="bg-grey-100 min-h-screen">
      <h1 className="text-3xl font-bold underline text-center text-grey-700 m-4">
        Route Details.
      </h1>
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
        <div className="flex flex-col items-center mt-8">
          {details.map((arrival: any) => (
            <ArrivalCard
              key={arrival.destinationName + arrival.timeToStation} //TODO sort out keys
              arrival={arrival}
              formatTime={formatTime}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default RouteDetail;
