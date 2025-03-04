import DateAndTimeForm from "@/components/form/FormHeader";
import MapComponent from "@/components/map";
import MapSidebar from "@/components/map/Sidebar/Sidebar.comp";
import { DateTimeProvider } from "@/context/DateTimeContext";
import { MapProvider } from "@/context/MapContenxt";
import { Photo_Location_Client } from "@/server/gis_query";

import { Noto_Sans_Georgian } from "next/font/google";
import { useState } from "react";
const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});
const MapTest = () => {
  const [loadedImages, setLoadedImages] = useState<Photo_Location_Client[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  return (
    <MapProvider>
      <DateTimeProvider>
        <div
          className={`w-full h-full ${notoGeorgian.className} flex flex-col overflow-hidden bg-black `}
        >
          {/* <DateAndTimeForm /> */}

          <section className="w-full h-full mx-auto  flex ">
            <section className="w-full sm:w-[calc(100%-750px)] lg:w-[40%] h-full   relative bg-yellow-300 flex-shrink-0">
              <MapComponent
                selectedPointID={selectedPointId}
                points={[]}
                defaultLocation={
                  [44.76129881033887, 41.718473154007896] as [number, number]
                }
                isInteractive={true}
                onNewCoordinates={(arg) => {
                  console.log(`We Are Setting Location Baby!`);
                  console.log(arg);
                }}
              />
            </section>
            <aside className="w-full absolute z-50 h-screen     pointer-events-none sm:pointer-events-auto top-0    lg:w-[60%]  overflow-auto sm:relative">
              {/* <MapSidebar photos={loadedImages} /> */}
              <MapSidebar />
            </aside>
          </section>
        </div>
      </DateTimeProvider>
    </MapProvider>
  );
};

export default MapTest;
