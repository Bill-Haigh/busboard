import React from "react";

export interface Arrival {
  stationName: string;
  lineName: string;
  destinationName: string;
  expectedArrival: string;
  timeToStation: number;
}

interface ArrivalCardProps {
  arrival: Arrival;
  formatTime: (seconds: number) => string;
}

const ArrivalCard: React.FC<ArrivalCardProps> = ({ arrival, formatTime }) => (
  <div className="border border-gray-300 rounded-lg p-4 bg-gray-100 shadow mb-2">
    <h3 className="text-md font-semibold mb-1 text-gray-800">
      {arrival.lineName}
    </h3>
    <p className="mb-1 text-gray-700">Destination: {arrival.destinationName}</p>
    <p className="mb-1 text-gray-700">
      Expected Arrival: {new Date(arrival.expectedArrival).toLocaleTimeString()}
    </p>
    <p className="mb-1 text-gray-700">
      Time to Station: {formatTime(arrival.timeToStation)}
    </p>
  </div>
);

export default ArrivalCard;
