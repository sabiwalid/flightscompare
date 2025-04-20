interface FiltersSummaryProps {
  totalResults: number;
}

export const FiltersSummary = ({ totalResults }: FiltersSummaryProps) => {
  return (
    <div className="text-sm text-gray-600 mb-4" aria-live="polite">
      {totalResults} flights match your filters
    </div>
  );
};
