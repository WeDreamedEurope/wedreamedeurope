import FormHeader from "@/components/form/FormHeader";
import MapComponent from "@/components/map";
import MapSidebar from "@/components/map/Sidebar/Sidebar.comp";
import { DateTimeProvider } from "@/context/DateTimeContext";
import { MapProvider, useMapContext } from "@/context/MapContenxt";
import { generateRandomData } from "@/lib/dummygisdata";
import testImage from "@/public/someimage.jpg";
import { Photo_Location_Select } from "@/server/gis_query";
import { Noto_Sans_Georgian } from "next/font/google";
import { useState } from "react";
const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});
const MapTest = () => {
  const [loadedImages, setLoadedImages] = useState<Photo_Location_Select[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const { setPointsToDisplay, pointsToDisplay } = useMapContext();
  const LoadConfigData = async () => {
    const params = new URLSearchParams({
      center: JSON.stringify([44.76129881033887, 41.718473154007896]),
      radius: JSON.stringify(300),
    });
    const response = await fetch(`/api/map?${params.toString()}`, {
      method: "get",
    });
    const data = (await response.json()) as Photo_Location_Select[];
    setPointsToDisplay(data.map(({ locationTakenAt }) => locationTakenAt));
  };

  const loadTestImages = (coordinates: [number, number]) => {
    const n = 5; // specify the number of items
    const emptyArray = Array(n)
      .fill("")
      .map((_, i) => testImage);

    const randomPoints = generateRandomData(
      n,
      coordinates[0],
      coordinates[1],
      0.05
    );

    const images = emptyArray.map<Photo_Location_Select>((_, index) => ({
      dateTakenAt: randomPoints[index]!.dateTakenAt!,
      id: index,
      locationTakenAt: randomPoints[index]!.locationTakenAt!,
      photoId: index.toString(),
    }));
    setLoadedImages(images);
  };

  return (
    <MapProvider>
      <DateTimeProvider>
        <div
          className={`w-full h-full ${notoGeorgian.className} flex flex-col overflow-hidden `}
        >
          <FormHeader />

          <section className="w-full h-full mx-auto  flex ">
            <section className="w-full sm:w-[calc(100%-750px)] lg:w-[40%] h-full   relative bg-yellow-300 flex-shrink-0">
              <MapComponent
                selectedPointID={selectedPointId}
                points={pointsToDisplay}
                defaultLocation={
                  [44.76129881033887, 41.718473154007896] as [number, number]
                }
                isInteractive={true}
                onNewCoordinates={(arg) => loadTestImages(arg)}
              />
            </section>
            <aside className="w-full bg-black  lg:w-[60%]  overflow-auto">
            
            <MapSidebar photos={loadedImages} />

            </aside>
            {/* Map Sidebar */}
          </section>
        </div>
      </DateTimeProvider>
    </MapProvider>
  );
};

export default MapTest;
