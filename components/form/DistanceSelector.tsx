import { useState } from "react";

export const DistanceSelector = () => {
  const [range, setRange] = useState(0);
  return (
    <input
      max={300}
      min={0}
      id="default-range"
      type="range"
      value={range}
      onChange={(e) => setRange(parseInt(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
  );
};
