import DateAndTimeForm from "@/components/form/FormHeader";
import { useMapContext } from "@/context/MapContenxt";
import { usePhotoLoader } from "@/context/PhotoLoaderContext";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlertIcon } from "lucide-react";
import SidebarGallery from "./SidebarGallery.comp";
import SidebarTutorialMob from "./SidebarTuTMob.comp";

export default function MapSidebar() {
  const { stateOfAction } = usePhotoLoader();
  const { selectedLocation } = useMapContext();
  return (
    <div className="w-full  flex-col  flex relative ">
      <header className="w-full    pointer-events-auto bg-gray-800 sticky top-0 z-50 ">
        <DateAndTimeForm />
      </header>

      <footer className="w-full  flex justify-center absolute z-50 bottom-10 h-auto">
        <button
          disabled={true}
          className="h-12 bg-black text-white  w-[calc(100%-40px)] flex items-center rounded-xl justify-center"
        >
          მოძებნე {stateOfAction}
        </button>
      </footer>

      <AnimatePresence mode="wait">
        {stateOfAction === "loaded" ? (
          <SidebarGallery />
        ) : (
          <SidebarTutorialMob key={'randomtutandshit'} />
        )}
      </AnimatePresence>
    </div>
  );
}
