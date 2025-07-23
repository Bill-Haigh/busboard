import React from "react";
import { Link } from "react-router-dom";

export interface Arrival {
  stationName: string;
  lineName: string;
  destinationName: string;
  expectedArrival: string;
  timeToStation: number;
  vehicleId: string;
}

interface ArrivalCardProps {
  arrival: Arrival;
  formatTime: (seconds: number) => string;
  onClick?: (vehicleId: string) => void;
  isLink: boolean;
}

const ArrivalCard: React.FC<ArrivalCardProps> = ({
  arrival,
  formatTime,
  onClick,
  isLink,
}) => (
  <>
    {isLink ? (
      <Link
        to={`/route/${arrival.vehicleId}`}
        tabIndex={0}
        role="button"
        aria-label={`View route details for vehicle ${arrival.vehicleId}`}
        className="border border-gray-300 rounded-lg p-4 bg-gray-100 shadow mb-2 cursor-pointer hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
        onClick={() => onClick && onClick(arrival.vehicleId)}
      >
        <h3 className="text-md font-semibold mb-1 text-gray-800">
          {arrival.lineName}
        </h3>
        <p className="mb-1 text-gray-700">
          Destination: {arrival.destinationName}
        </p>
        <p className="mb-1 text-gray-700">
          Expected Arrival:{" "}
          {new Date(arrival.expectedArrival).toLocaleTimeString()}
        </p>
        <p className="mb-1 text-gray-700">
          Time to Station: {formatTime(arrival.timeToStation)}
        </p>
      </Link>
    ) : (
      <div
        tabIndex={0}
        role="button"
        aria-label={`View route details for vehicle ${arrival.vehicleId}`}
        className="border border-gray-300 rounded-lg p-4 bg-gray-100 shadow mb-2"
      >
        <h3 className="text-md font-semibold mb-1 text-gray-800">
          {arrival.lineName}
        </h3>
        <p className="mb-1 text-gray-700">
          Destination: {arrival.destinationName}
        </p>
        <p className="mb-1 text-gray-700">
          Expected Arrival:{" "}
          {new Date(arrival.expectedArrival).toLocaleTimeString()}
        </p>
        <p className="mb-1 text-gray-700">
          Time to Station: {formatTime(arrival.timeToStation)}
        </p>
      </div>
    )}
  </>
);

export default ArrivalCard;
