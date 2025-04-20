import React from "react";
import { FlightDeal } from "../types/flight";
import { Plane, Clock, Luggage, Users } from "lucide-react";

interface FlightCardProps {
  flight: FlightDeal;
  onRemove: () => void;
  isSelected?: boolean;
}

export const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  onRemove,
  isSelected,
}) => {
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

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onRemove();
    }
  };

  const departureInfo = `Departing from ${flight.Origin} at ${formatTime(
    flight.DepartureTime
  )}`;
  const arrivalInfo = `Arriving at ${flight.Destination} at ${formatTime(
    flight.ArrivalTime
  )}`;
  const durationInfo = `Flight duration: ${formatDuration(
    flight.TotalTravelTimeMinutes
  )}`;
  const priceInfo = `Price: ${flight.Cost}`;
  const savingsInfo =
    flight.CostBelowAverage > 0
      ? `Save $${flight.CostBelowAverage.toFixed(
          2
        )}, ${flight.PercentBelowAverage.toFixed(1)}% below average`
      : "";

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 relative"
      role="article"
      aria-label={`Flight from ${flight.Origin} to ${flight.Destination} by ${flight.Legs[0].AirlineName}, ${priceInfo}`}
    >
      {isSelected && (
        <button
          onClick={handleRemoveClick}
          onKeyDown={handleKeyPress}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label={`Remove ${flight.Origin} to ${flight.Destination} flight from selection`}
          tabIndex={0}
        >
          ×
        </button>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Plane className="w-6 h-6 text-blue-500" aria-hidden="true" />
          <span className="font-semibold text-lg">
            {flight.Legs[0].AirlineName}
          </span>
        </div>
        <span
          className="text-2xl font-bold text-blue-600"
          aria-label={priceInfo}
        >
          {flight.Cost}
        </span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-center" aria-label={departureInfo}>
          <div className="text-xl font-bold">
            {formatTime(flight.DepartureTime)}
          </div>
          <div className="text-sm text-gray-600">{flight.Origin}</div>
        </div>
        <div className="flex-1 mx-4 relative">
          <div
            className="border-t-2 border-gray-300 absolute w-full top-1/2"
            aria-hidden="true"
          ></div>
          <div className="text-center relative" aria-label={durationInfo}>
            <Clock className="w-4 h-4 inline mb-1" aria-hidden="true" />
            <div className="text-sm text-gray-600">
              {formatDuration(flight.TotalTravelTimeMinutes)}
            </div>
          </div>
        </div>
        <div className="text-center" aria-label={arrivalInfo}>
          <div className="text-xl font-bold">
            {formatTime(flight.ArrivalTime)}
          </div>
          <div className="text-sm text-gray-600">{flight.Destination}</div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 border-t pt-4">
        <div className="flex items-center">
          <Luggage className="w-4 h-4 mr-1" aria-hidden="true" />
          <span>
            {flight.BaggageAmount} {flight.BaggageType}
          </span>
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1" aria-hidden="true" />
          <span>{flight.SeatsAvailable} seats left</span>
        </div>
      </div>

      {flight.CostBelowAverage > 0 && (
        <div className="mt-2 text-sm text-green-600" aria-label={savingsInfo}>
          Save ${flight.CostBelowAverage.toFixed(2)} (
          {flight.PercentBelowAverage.toFixed(1)}% below average)
        </div>
      )}
    </div>
  );
};
