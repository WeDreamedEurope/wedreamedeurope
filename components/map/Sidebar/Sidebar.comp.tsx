import { Photo_Location_Client } from "@/server/gis_query";
import { useDateTimeContext } from "@/context/DateTimeContext";
import { useMapContext } from "@/context/MapContenxt";
import Sidebartutorial from "./PSA.comp";
import SidebarGallery from "./SidebarGallery.comp";
// type Props = {
//   photos: Photo_Location_Client[];
// };

export default function MapSidebar() {
  const { selectedLocation } = useMapContext();
  const { isValidTime } = useDateTimeContext();
  return (
    <>
      {selectedLocation && isValidTime ? (
        <SidebarGallery />
      ) : (
        <div className="hidden relative sm:flex w-full h-full bg-[#222831]" >
          <Sidebartutorial />
        </div>
      )}
      {/* <Sidebartutorial /> */}
    </>
  );
}
