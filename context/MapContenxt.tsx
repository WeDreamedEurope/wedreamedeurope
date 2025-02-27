import { createContext, ReactNode, useContext, useState } from "react";

interface IMapContext {
  selectedLocation: [number, number] | null;
  setSelectedLocation: (location: [number, number]) => void;
  pointsToDisplay: [number, number][];
  setPointsToDisplay: (points: [number, number][]) => void;
  selectedPointId: string | null;
  setSelectedPointId: (id: string) => void;
  debugText?: string;
  setDebugText: (text: string) => void;
}

const MapContext = createContext<IMapContext | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [pointsToDisplay, setPointsToDisplay] = useState<[number, number][]>(
    []
  );
  const [debugText, setDebugText] = useState<string>("Initial Debug Text");

  return (
    <MapContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        pointsToDisplay,
        selectedPointId,
        setSelectedPointId,
        setPointsToDisplay,
        setDebugText,
        debugText,
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
