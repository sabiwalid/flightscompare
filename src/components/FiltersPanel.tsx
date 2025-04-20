import React from "react";

interface FiltersPanelProps {
  id: string;
  airlines: string[];
  selectedAirlines: string[];
  onAirlineChange: (airline: string, isChecked: boolean) => void;
  maxStops: number;
  onStopsChange: (value: number) => void;
  departureTimeRange: [number, number];
  onDepartureTimeChange: (range: [number, number]) => void;
  arrivalTimeRange: [number, number];
  onArrivalTimeChange: (range: [number, number]) => void;
  onClear: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  id,
  airlines,
  selectedAirlines,
  onAirlineChange,
  maxStops,
  onStopsChange,
  departureTimeRange,
  onDepartureTimeChange,
  arrivalTimeRange,
  onArrivalTimeChange,
  onClear,
}) => {
  const formatTimeDisplay = (hour: number): string => {
    const hourPart = Math.floor(hour);
    const minutePart = Math.round((hour - hourPart) * 60);
    const period = hourPart >= 12 ? "PM" : "AM";
    const displayHour = hourPart % 12 === 0 ? 12 : hourPart % 12;
    return `${displayHour}:${minutePart.toString().padStart(2, "0")} ${period}`;
  };

  const handleDepartureMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onDepartureTimeChange([value, departureTimeRange[1]]);
  };

  const handleDepartureMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onDepartureTimeChange([departureTimeRange[0], value]);
  };

  const handleArrivalMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onArrivalTimeChange([value, arrivalTimeRange[1]]);
  };

  const handleArrivalMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onArrivalTimeChange([arrivalTimeRange[0], value]);
  };

  return (
    <div
      id={id}
      className="bg-white rounded-lg shadow-md p-4 mt-4"
      role="region"
      aria-label="Additional filters"
    >
      {/* Airlines Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Airlines</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {airlines.map((airline) => (
            <div key={airline} className="flex items-center">
              <input
                id={`airline-${airline.replace(/\s+/g, "-").toLowerCase()}`}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={selectedAirlines.includes(airline)}
                onChange={(e) => onAirlineChange(airline, e.target.checked)}
                aria-label={airline}
              />
              <label
                htmlFor={`airline-${airline
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
                className="ml-2 text-sm text-gray-700"
              >
                {airline}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Number of Stops Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Number of Stops</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="stops-nonstop"
              type="radio"
              name="stops"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              checked={maxStops === 0}
              onChange={() => onStopsChange(0)}
              aria-label="Non-stop flights only"
            />
            <label
              htmlFor="stops-nonstop"
              className="ml-2 text-sm text-gray-700"
            >
              Non-stop only
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="stops-one"
              type="radio"
              name="stops"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              checked={maxStops === 1}
              onChange={() => onStopsChange(1)}
              aria-label="Up to 1 stop"
            />
            <label htmlFor="stops-one" className="ml-2 text-sm text-gray-700">
              Up to 1 stop
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="stops-two"
              type="radio"
              name="stops"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              checked={maxStops === 2}
              onChange={() => onStopsChange(2)}
              aria-label="Up to 2 stops"
            />
            <label htmlFor="stops-two" className="ml-2 text-sm text-gray-700">
              Up to 2 stops
            </label>
          </div>
        </div>
      </div>

      {/* Departure Time Range */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Departure Time</h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="departure-min"
              className="block text-sm text-gray-700 mb-1"
            >
              Earliest: {formatTimeDisplay(departureTimeRange[0])}
            </label>
            <input
              id="departure-min"
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={departureTimeRange[0]}
              onChange={handleDepartureMinChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-valuetext={formatTimeDisplay(departureTimeRange[0])}
            />
          </div>
          <div>
            <label
              htmlFor="departure-max"
              className="block text-sm text-gray-700 mb-1"
            >
              Latest: {formatTimeDisplay(departureTimeRange[1])}
            </label>
            <input
              id="departure-max"
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={departureTimeRange[1]}
              onChange={handleDepartureMaxChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-valuetext={formatTimeDisplay(departureTimeRange[1])}
            />
          </div>
        </div>
      </div>

      {/* Arrival Time Range */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Arrival Time</h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="arrival-min"
              className="block text-sm text-gray-700 mb-1"
            >
              Earliest: {formatTimeDisplay(arrivalTimeRange[0])}
            </label>
            <input
              id="arrival-min"
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={arrivalTimeRange[0]}
              onChange={handleArrivalMinChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-valuetext={formatTimeDisplay(arrivalTimeRange[0])}
            />
          </div>
          <div>
            <label
              htmlFor="arrival-max"
              className="block text-sm text-gray-700 mb-1"
            >
              Latest: {formatTimeDisplay(arrivalTimeRange[1])}
            </label>
            <input
              id="arrival-max"
              type="range"
              min="0"
              max="24"
              step="0.5"
              value={arrivalTimeRange[1]}
              onChange={handleArrivalMaxChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-valuetext={formatTimeDisplay(arrivalTimeRange[1])}
            />
          </div>
        </div>
      </div>

      {/* Clear All Filters Button */}
      <button
        onClick={onClear}
        className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Clear all filters"
      >
        Clear All Filters
      </button>
    </div>
  );
};
