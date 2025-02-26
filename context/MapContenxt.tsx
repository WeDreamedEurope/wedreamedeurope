import { createContext, ReactNode, useContext, useState } from "react";

interface IMapContext {
  selectedLocation: [number, number] | null;
  setSelectedLocation: (location: [number, number]) => void;
  pointsToDisplay: [number, number][];
  setPointsToDisplay: (points: [number, number][]) => void;
  selectedPointId: string | null;
  setSelectedPointId: (id: string) => void;
}

const MapContext = createContext<IMapContext>({
  selectedLocation: null,
  setSelectedLocation: () => {},
  pointsToDisplay: [],
  selectedPointId: null,
  setSelectedPointId: () => {},
  setPointsToDisplay: () => {},
});

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [pointsToDisplay, setPointsToDisplay] = useState<[number, number][]>(
    []
  );

  return (
    <MapContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        pointsToDisplay,
        selectedPointId,
        setSelectedPointId,
        setPointsToDisplay,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}
