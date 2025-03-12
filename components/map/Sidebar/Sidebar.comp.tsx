import DateAndTimeForm from "@/components/form/FormHeader";
import { usePhotoLoader } from "@/context/PhotoLoaderContext";
import { AnimatePresence } from "framer-motion";
import SidebarGallery from "./SidebarGallery.comp";
import SidebarTutorialMob from "./SidebarTuTMob.comp";
import NothingFound from "./NothingFound.comp";
import SidebarTutorial from "./SidebarTutDesktop.comp";

export default function MapSidebar() {
  const { stateOfAction, photos } = usePhotoLoader();
  return (
    <div className="w-full  flex-col  flex relative ">
      <header className="w-full    pointer-events-auto bg-gray-800 sticky top-0 z-50 ">
        <DateAndTimeForm />
      </header>

      <AnimatePresence mode="wait">
        {stateOfAction === "loaded" && photos.length > 0 ? (
          <SidebarGallery />
        ) : stateOfAction === "loaded" && photos.length === 0 ? (
          <NothingFound />
        ) : (
          <SidebarTutorial key={'sidebartutorialkeybro'} />
        )}
      </AnimatePresence>
    </div>
  );
}
