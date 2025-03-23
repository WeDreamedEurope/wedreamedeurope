import { useDateTimeContext } from "@/context/DateTimeContext";
import { useMapContext } from "@/context/MapContenxt";
import { calculateDistanceInMeters } from "@/lib/dummygisdata";
import {
  getPhotosInRadiusAndTimeRangeClient,
  Photo_Location_Select,
  Photo_Location_Select_With_URL,
} from "@/API_CALLS/gis_query";
import { format, toZonedTime } from "date-fns-tz";
import { ka } from "date-fns/locale";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { formatDateWithTimezone } from "@/lib/utils";

type PhotoLoaderContextType = {
  photos: Photo_Location_Select_With_URL[];
  readyForLoad: boolean;
  loadPhotos: () => Promise<void>;
  stateOfAction: "idle" | "loading" | "loaded";
  setStateOfAction: (state: "idle" | "loading" | "loaded") => void;
};

const PhotoLoaderContext = createContext<PhotoLoaderContextType | undefined>(
  undefined
);

export function PhotoLoaderProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Photo_Location_Select_With_URL[]>([]);
  const { selectedLocation, setPointsToDisplay } = useMapContext();
  const { isValidTime, selectedDate } = useDateTimeContext();
  const [readyForLoad, setReadyForLoad] = useState(false);
  const [stateOfAction, setStateOfAction] = useState<
    "idle" | "loading" | "loaded"
  >("idle");

  useEffect(() => {
    if (selectedLocation && isValidTime) {
      setReadyForLoad(true);
    }
  }, [selectedLocation, isValidTime]);

  const loadPhotos = async () => {
    setStateOfAction("loading");
    const photos = await getPhotosInRadiusAndTimeRangeClient({
      locationTakenAt: selectedLocation!,
      dateTakenAt: selectedDate!.toISOString(),
      radius: 100,
    });

    setPhotos(
      photos
        .map((p) => ({
          ...p,
          dateTakenAt: formatDateWithTimezone(p.dateTakenAt!),
          distance: calculateDistanceInMeters(
            selectedLocation!,
            p.locationTakenAt
          ),
        }))
        .sort((a, b) => a.distance - b.distance)
    );
    setStateOfAction(() => "loaded");
    setPointsToDisplay(photos.map((i) => i.locationTakenAt));
  };

  const value = {
    photos,
    readyForLoad,
    loadPhotos,
    stateOfAction,
    setStateOfAction,
  };

  return (
    <PhotoLoaderContext.Provider value={value}>
      {children}
    </PhotoLoaderContext.Provider>
  );
}

export function usePhotoLoader() {
  const context = useContext(PhotoLoaderContext);
  if (context === undefined) {
    throw new Error("usePhotoLoader must be used within a PhotoLoaderProvider");
  }
  return context;
}
