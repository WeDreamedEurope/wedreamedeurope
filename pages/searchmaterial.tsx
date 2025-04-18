import MapComponent from "@/components/map";
import MapSidebar from "@/components/map/Sidebar/Sidebar.comp";
import { DateTimeProvider } from "@/context/DateTimeContext";
import { MapProvider } from "@/context/MapContenxt";
import { PhotoLoaderProvider } from "@/context/PhotoLoaderContext";

import { Noto_Sans_Georgian } from "next/font/google";
const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});
const MapTest = () => {
  return (
    <MapProvider>
      <DateTimeProvider>
        <div
          className={`w-full h-full ${notoGeorgian.className} flex flex-col overflow-hidden bg-eu-primary `}
        >
          {/* <DateAndTimeForm /> */}

          <section className="w-full h-full mx-auto  flex ">
            <section className="w-full sm:w-[calc(100%-750px)] lg:w-[40%] h-full   relative  flex-shrink-0">
              <MapComponent
                selectedPointID={""}
                points={[]}
                defaultLocation={null}
                isInteractive={true}
              />
            </section>
            <aside className="w-full flex absolute z-50 h-full  pointer-events-none sm:pointer-events-auto   top-0    lg:w-[60%]  overflow-hidden sm:relative">
              <PhotoLoaderProvider>
                <MapSidebar />
              </PhotoLoaderProvider>
            </aside>
          </section>
        </div>
      </DateTimeProvider>
    </MapProvider>
  );
};

export default MapTest;
