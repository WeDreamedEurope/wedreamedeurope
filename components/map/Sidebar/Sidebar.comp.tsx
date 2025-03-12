import DateAndTimeForm from "@/components/form/FormHeader";
import { usePhotoLoader } from "@/context/PhotoLoaderContext";
import { AnimatePresence } from "framer-motion";
import SidebarGallery from "./SidebarGallery.comp";
import SidebarTutorialMob from "./SidebarTuTMob.comp";

export default function MapSidebar() {
  const { stateOfAction } = usePhotoLoader();
  return (
    <div className="w-full  flex-col  flex relative ">
      <header className="w-full    pointer-events-auto bg-gray-800 sticky top-0 z-50 ">
        <DateAndTimeForm />
      </header>

      <AnimatePresence mode="wait">
        {stateOfAction === "loaded" ? (
          <SidebarGallery />
        ) : (
          <SidebarTutorialMob key={"randomtutandshit"} />
        )}
      </AnimatePresence>
    </div>
  );
}
