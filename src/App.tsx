import React, { useState, useEffect } from "react";
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
      }

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePriceChange = (min: number, max: number) => {
    setCurrentMinPrice(min);
    setCurrentMaxPrice(max);
    setFilteredFlights(
      flightDeals.filter(
        (flight) => flight.CostFloat >= min && flight.CostFloat <= max
      )
    );
  };

  const clearFilters = () => {
    setCurrentMinPrice(minPrice);
    setCurrentMaxPrice(maxPrice);
    setFilteredFlights(flightDeals);
  };

  const toggleFlight = (flight: FlightDeal) => {
    if (selectedFlights.find((f) => f.PurchasingId === flight.PurchasingId)) {
      setSelectedFlights(
        selectedFlights.filter((f) => f.PurchasingId !== flight.PurchasingId)
      );
    } else if (selectedFlights.length < 3) {
      setSelectedFlights([...selectedFlights, flight]);
    }
  };

  const shareComparison = async () => {
    try {
      const ids = selectedFlights.map((f) => f.PurchasingId).join(",");
      const url = `${window.location.origin}?flights=${ids}`;

      await navigator.clipboard.writeText(url);
      alert("Comparison link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      alert(
        `Your comparison link: ${
          window.location.origin
        }?flights=${selectedFlights
          .map((f) => f.PurchasingId)
          .join(",")}\n\nPlease copy it manually.`
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Flight Comparison
          </h1>
          {selectedFlights.length > 0 && (
            <button
              onClick={shareComparison}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Comparison
            </button>
          )}
        </div>

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
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
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
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Available Flights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFlights.map((flight) => (
                  <div
                    key={flight.PurchasingId}
                    className={`cursor-pointer transition-transform hover:scale-105 ${
                      selectedFlights.find(
                        (f) => f.PurchasingId === flight.PurchasingId
                      )
                        ? "ring-2 ring-blue-500 rounded-lg"
                        : ""
                    }`}
                    onClick={() => toggleFlight(flight)}
                  >
                    <FlightCard flight={flight} onRemove={() => {}} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
