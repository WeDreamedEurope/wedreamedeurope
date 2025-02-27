import { Photo_Location_Client } from "@/server/gis_query";
import Image from "next/image";
import { Button } from "../../ui/button";
import testImage from "@/public/someimage.jpg";
import { useMapContext } from "@/context/MapContenxt";
import Sidebartutorial from "./PSA.comp";
import { useEffect, useState } from "react";
import {
  calculateDistanceInMeters,
  generateRandomData,
} from "@/lib/dummygisdata";
import { useDateTimeContext } from "@/context/DateTimeContext";

type Props = {
  photos: Photo_Location_Client[];
};

const SidebarGallery = () => {
  const { setSelectedPointId, selectedLocation, setPointsToDisplay } =
    useMapContext();
  const [photos, setPhotos] = useState<Photo_Location_Client[]>([]);
  
  useEffect(() => {
    if (selectedLocation) {
      const randomPhotos = randomPhotosGenerator(selectedLocation);
      setPointsToDisplay(randomPhotos.map((p) => p.locationTakenAt));
      setPhotos(randomPhotos);
    }
  }, [selectedLocation]);

  const randomPhotosGenerator = (location: [number, number]) =>
    // 44.762327177662875, 41.71848662012972

    generateRandomData(500, 44.762327177662875, 41.71848662012972, 0.5)
      .map<Photo_Location_Client>((i, index) => ({
        ...i,
        id: index,
        dateTakenAt: i.dateTakenAt!,
        distance: calculateDistanceInMeters(location, i.locationTakenAt),
      }))
      .filter(({ distance }) => distance <= 50)
      .sort((a, b) => a.distance - b.distance);

  return (
    <article className="w-full grid grid-cols-2   p-4  place-content-start gap-2 overflow-auto pb-32 bg-black">
      {photos.map((i, index) => (
        <div
          onClick={() => setSelectedPointId(index.toString())}
          key={index}
          className="w-full aspect-video flex flex-col relative border border-gray-600 hover:cursor-pointer "
        >
          <div className="relative  w-full aspect-video">
            <Image src={testImage} fill alt="" className="object-cover" />
          </div>
          <div className="text-gray-300 font-semibold text-sm px-2 py-2  flex items-center justify-between ">
            <div>27.12.1986</div>
            <div>~ {i.distance.toFixed(2)}მ</div>
            <div>
              <Button size={"sm"}>რუკაზე ნახვა</Button>
            </div>
          </div>
        </div>
      ))}
    </article>
  );
};

export default function MapSidebar({ photos }: Props) {
  const { selectedLocation } = useMapContext();
  const { isValidTime } = useDateTimeContext();
  return (
    <>
      {selectedLocation && isValidTime ? (
        <SidebarGallery />
      ) : (
        <Sidebartutorial />
      )}
      {/* <Sidebartutorial /> */}
    </>
  );
}
