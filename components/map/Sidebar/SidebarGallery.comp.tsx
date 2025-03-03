import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContenxt";
import {
  calculateDistanceInMeters,
  generateRandomData,
} from "@/lib/dummygisdata";
import { Photo_Location_Client } from "@/server/gis_query";
import { format } from "date-fns";
import { ka } from "date-fns/locale";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
const tempShit =
  "https://images.unsplash.com/photo-1485056981035-7a565c03c6aa?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const SidebarGallery = () => {
  const { setSelectedPointId, selectedLocation, setPointsToDisplay } =
    useMapContext();
  const [photos, setPhotos] = useState<Photo_Location_Client[]>([]);
  const randomPhotosGenerator = (location: [number, number]) =>
    generateRandomData(500, 44.762327177662875, 41.71848662012972, 0.5)
      .map<Photo_Location_Client>((i, index) => ({
        ...i,
        id: index,
        dateTakenAt: format(i.dateTakenAt!, "dd MMM HH:mm", { locale: ka }),
        distance: calculateDistanceInMeters(location, i.locationTakenAt),
      }))
      .filter(({ distance }) => distance <= 50)
      .sort((a, b) => a.distance - b.distance);

  const memoizedPhotos = useMemo(() => {
    if (selectedLocation) {
      console.log(`Random Photo Generation Kicked In!`);
      return randomPhotosGenerator(selectedLocation);
    }
    return [];
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedLocation) {
      setPointsToDisplay(memoizedPhotos.map((p) => p.locationTakenAt));
      setPhotos(memoizedPhotos);
    }
  }, [selectedLocation, memoizedPhotos, setPointsToDisplay]);

  return (
    <article className="w-full relative sm:grid sm:grid-flow-row sm:grid-cols-2 min-h-full h-auto p-0 sm:p-4 place-content-start gap-2 py-5 pointer-events-auto sm:pb-32 text-gray-900 bg-[#121212] space-y-3 px-2">
      {photos.map((i, index) => (
        <div
          onClick={() => setSelectedPointId(index.toString())}
          key={index}
          className="min-w-full h-auto flex flex-col relative sm:border-gray-600 hover:cursor-pointer text-red-300 bg-[#202127] overflow-hidden rounded-md"
        >
          <div className="relative w-full aspect-video min-w-full">
            <Image src={tempShit} fill alt="" className="object-cover" />
          </div>
          <div className="text-[#9494bf] font-semibold text-sm px-2 py-2 flex items-center justify-between">
            <div>{i.dateTakenAt}</div>
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

export default SidebarGallery;
