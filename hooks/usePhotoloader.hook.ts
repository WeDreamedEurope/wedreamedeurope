import { useDateTimeContext } from "@/context/DateTimeContext";
import { useMapContext } from "@/context/MapContenxt";
import {
  getPhotosInRadiusAndTimeRangeClient,
  Photo_Location_Client,
} from "@/server/gis_query";
import { toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";

export default function usePhotoLoader() {
  const [photos, setPhotos] = useState<Photo_Location_Client[]>([]);
  const { selectedLocation, setPointsToDisplay } = useMapContext();
  const { isValidTime, selectedDate } = useDateTimeContext();
  const [readyForLoad, setReadyForLoad] = useState(false);
  const [stateOfAction, setStateOfAction] = useState<
    "idle" | "loading" | "loaded" | "BOBO"
  >("BOBO");
  useEffect(() => {
    if (selectedLocation && isValidTime) {
      console.log(`I Am Ready To Load The Photos!`);
      setReadyForLoad(true);
    }
  }, [selectedLocation, isValidTime]);

  const loadPhotos = async () => {
    console.log(selectedDate);
    console.log(selectedDate?.toISOString());

    const photos = await getPhotosInRadiusAndTimeRangeClient({
      locationTakenAt: selectedLocation!,
      dateTakenAt: selectedDate!.toISOString(),
      photoId: "123",
      id: 0,
      userId: null,
    });

    setPhotos(
      photos.map((p) => ({
        ...p,
        dateTakenAt: toZonedTime(p.dateTakenAt!, "Asia/Tbilisi").toString(),
      }))
    );
    console.log(`We Are Here?!`)
    setStateOfAction(() => "loaded");
    // setPointsToDisplay(photos.map((i) => i.locationTakenAt));
  };

  const tempHandlerOrWhatever = ()=>{
      setStateOfAction(()=>"loading")
  }
  return {
    photos,
    readyForLoad,
    loadPhotos,
    stateOfAction,
    tempHandlerOrWhatever
  };
}
