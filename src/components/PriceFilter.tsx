import React from 'react';

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  currentMin: number;
  currentMax: number;
  onPriceChange: (min: number, max: number) => void;
  onClear: () => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  minPrice,
  maxPrice,
  currentMin,
  currentMax,
  onPriceChange,
  onClear,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Price Range</h2>
        <button
          onClick={onClear}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">${currentMin}</span>
          <span className="text-gray-600">${currentMax}</span>
        </div>
        
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={currentMin}
          onChange={(e) => onPriceChange(Number(e.target.value), currentMax)}
          className="w-full"
        />
        
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={currentMax}
          onChange={(e) => onPriceChange(currentMin, Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};