import { useDateTimeContext } from "@/context/DateTimeContext";
import { useMapContext } from "@/context/MapContenxt";
import { calculateDistanceInMeters } from "@/lib/dummygisdata";
import {
  getPhotosInRadiusAndTimeRangeClient,
  Photo_Location_Client,
} from "@/server/gis_query";
import { format, toZonedTime } from "date-fns-tz";
import { ka } from "date-fns/locale";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type PhotoLoaderContextType = {
  photos: Photo_Location_Client[];
  readyForLoad: boolean;
  loadPhotos: () => Promise<void>;
  stateOfAction: "idle" | "loading" | "loaded" | "BOBO";
  setStateOfAction: (state: "idle" | "loading" | "loaded" | "BOBO") => void;
};

const PhotoLoaderContext = createContext<PhotoLoaderContextType | undefined>(
  undefined
);

export function PhotoLoaderProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Photo_Location_Client[]>([]);
  const { selectedLocation, setPointsToDisplay } = useMapContext();
  const { isValidTime, selectedDate } = useDateTimeContext();
  const [readyForLoad, setReadyForLoad] = useState(false);
  const [stateOfAction, setStateOfAction] = useState<
    "idle" | "loading" | "loaded" | "BOBO"
  >("idle");

  useEffect(() => {
    if (selectedLocation && isValidTime) {
      if (readyForLoad === true) {
        loadPhotos();
      } else {
        setReadyForLoad(true);
      }
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
          dateTakenAt: format(
            toZonedTime(p.dateTakenAt!, "Asia/Tbilisi"),
            "dd.MMM HH:mm",
            { locale: ka }
          ),
          distance: calculateDistanceInMeters(
            p.locationTakenAt,
            selectedLocation!
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
