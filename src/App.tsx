import React, { useState, useEffect, KeyboardEvent } from "react";
import { FlightCard } from "./components/FlightCard";
import { PriceFilter } from "./components/PriceFilter";
import { flightDeals } from "./data/flightDeals";
import { FlightDeal } from "./types/flight";
import { Share2 } from "lucide-react";

function App() {
  const [selectedFlights, setSelectedFlights] = useState<FlightDeal[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [currentMinPrice, setCurrentMinPrice] = useState(0);
  const [currentMaxPrice, setCurrentMaxPrice] = useState(0);
  const [filteredFlights, setFilteredFlights] = useState<FlightDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  const announceToScreenReader = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      const prices = flightDeals.map((flight) => flight.CostFloat);
      setMinPrice(Math.min(...prices));
      setMaxPrice(Math.max(...prices));
      setCurrentMinPrice(Math.min(...prices));
      setCurrentMaxPrice(Math.max(...prices));
      setFilteredFlights(flightDeals);

      const urlParams = new URLSearchParams(window.location.search);
      const sharedFlights = urlParams.get("flights");

      if (sharedFlights) {
        const flightIds = sharedFlights.split(",");
        const foundFlights = flightDeals.filter((flight) =>
          flightIds.includes(flight.PurchasingId.toString())
        );
        setSelectedFlights(foundFlights.slice(0, 3));
        if (foundFlights.length > 0) {
          announceToScreenReader(
            `${foundFlights.length} shared flights loaded for comparison`
          );
        }
      }

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePriceChange = (min: number, max: number) => {
    setCurrentMinPrice(min);
    setCurrentMaxPrice(max);
    const filtered = flightDeals.filter(
      (flight) => flight.CostFloat >= min && flight.CostFloat <= max
    );
    setFilteredFlights(filtered);
    announceToScreenReader(
      `Price filter applied. ${filtered.length} flights found between $${min} and $${max}`
    );
  };

  const clearFilters = () => {
    setCurrentMinPrice(minPrice);
    setCurrentMaxPrice(maxPrice);
    setFilteredFlights(flightDeals);
    announceToScreenReader(
      `Filters cleared. Showing ${flightDeals.length} flights`
    );
  };

  const toggleFlight = (flight: FlightDeal) => {
    if (selectedFlights.find((f) => f.PurchasingId === flight.PurchasingId)) {
      setSelectedFlights(
        selectedFlights.filter((f) => f.PurchasingId !== flight.PurchasingId)
      );
      announceToScreenReader(
        `Removed flight to ${flight.Destination} from selection`
      );
    } else if (selectedFlights.length < 3) {
      setSelectedFlights([...selectedFlights, flight]);
      announceToScreenReader(
        `Added flight to ${flight.Destination} to comparison`
      );
    } else {
      announceToScreenReader(
        "Maximum of 3 flights can be selected for comparison"
      );
    }
  };

  const handleFlightKeyPress = (
    event: KeyboardEvent<HTMLDivElement>,
    flight: FlightDeal
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlight(flight);
    }
  };

  const shareComparison = async () => {
    try {
      const ids = selectedFlights.map((f) => f.PurchasingId).join(",");
      const url = `${window.location.origin}?flights=${ids}`;

      await navigator.clipboard.writeText(url);
      announceToScreenReader("Comparison link copied to clipboard");
      alert("Comparison link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      const shareUrl = `${window.location.origin}?flights=${selectedFlights
        .map((f) => f.PurchasingId)
        .join(",")}`;
      announceToScreenReader(
        "Unable to automatically copy link. Please copy the link manually"
      );
      alert(`Your comparison link: ${shareUrl}\n\nPlease copy it manually.`);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-100 flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          aria-hidden="true"
        ></div>
        <span className="sr-only">Loading flights</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notification}
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Flight Comparison
          </h1>
          {selectedFlights.length > 0 && (
            <button
              onClick={shareComparison}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
              aria-label={`Share comparison of ${selectedFlights.length} flights`}
            >
              <Share2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Share Comparison
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              currentMin={currentMinPrice}
              currentMax={currentMaxPrice}
              onPriceChange={handlePriceChange}
              onClear={clearFilters}
            />
          </div>

          <div className="md:col-span-3">
            <section
              className="bg-white rounded-lg shadow-md p-6 mb-6"
              aria-labelledby="comparison-heading"
            >
              <h2
                id="comparison-heading"
                className="text-xl font-semibold mb-4"
              >
                Selected Flights for Comparison
              </h2>
              {selectedFlights.length === 0 ? (
                <p className="text-gray-600">
                  Select up to 3 flights to compare
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedFlights.map((flight) => (
                    <FlightCard
                      key={flight.PurchasingId}
                      flight={flight}
                      onRemove={() => toggleFlight(flight)}
                      isSelected={true}
                    />
                  ))}
                </div>
              )}
            </section>

            <section
              className="bg-white rounded-lg shadow-md p-6"
              aria-labelledby="available-flights-heading"
            >
              <h2
                id="available-flights-heading"
                className="text-xl font-semibold mb-4"
              >
                Available Flights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFlights.map((flight) => {
                  const isSelected = selectedFlights.some(
                    (f) => f.PurchasingId === flight.PurchasingId
                  );
                  return (
                    <div
                      key={flight.PurchasingId}
                      className={`cursor-pointer transition-transform hover:scale-105 ${
                        isSelected ? "ring-2 ring-blue-500 rounded-lg" : ""
                      }`}
                      onClick={() => toggleFlight(flight)}
                      onKeyDown={(e) => handleFlightKeyPress(e, flight)}
                      tabIndex={0}
                      role="button"
                      aria-pressed={isSelected}
                      aria-label={`Flight to ${flight.Destination} for ${
                        flight.Cost
                      }${isSelected ? ", selected" : ""}`}
                    >
                      <FlightCard
                        flight={flight}
                        onRemove={() => {}}
                        isSelected={isSelected}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
