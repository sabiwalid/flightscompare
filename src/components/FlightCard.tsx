import React from "react";
import { FlightDeal } from "../types/flight";
import { Plane, Clock, Luggage, Users } from "lucide-react";

interface FlightCardProps {
  flight: FlightDeal;
  onRemove: () => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onRemove }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: string) => {
    const hrs = Math.floor(parseInt(minutes) / 60);
    const mins = parseInt(minutes) % 60;
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Plane className="w-6 h-6 text-blue-500" />
          <span className="font-semibold text-lg">
            {flight.Legs[0].AirlineName}
          </span>
        </div>
        <span className="text-2xl font-bold text-blue-600">{flight.Cost}</span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="text-xl font-bold">
            {formatTime(flight.DepartureTime)}
          </div>
          <div className="text-sm text-gray-600">{flight.Origin}</div>
        </div>
        <div className="flex-1 mx-4 relative">
          <div className="border-t-2 border-gray-300 absolute w-full top-1/2"></div>
          <div className="text-center relative">
            <Clock className="w-4 h-4 inline mb-1" />
            <div className="text-sm text-gray-600">
              {formatDuration(flight.TotalTravelTimeMinutes)}
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">
            {formatTime(flight.ArrivalTime)}
          </div>
          <div className="text-sm text-gray-600">{flight.Destination}</div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 border-t pt-4">
        <div className="flex items-center">
          <Luggage className="w-4 h-4 mr-1" />
          {flight.BaggageAmount} {flight.BaggageType}
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" />
          {flight.SeatsAvailable} seats left
        </div>
      </div>

      {flight.CostBelowAverage > 0 && (
        <div className="mt-2 text-sm text-green-600">
          Save ${flight.CostBelowAverage.toFixed(2)} (
          {flight.PercentBelowAverage.toFixed(1)}% below average)
        </div>
      )}
    </div>
  );
};
