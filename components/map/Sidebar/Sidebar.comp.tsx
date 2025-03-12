import DateAndTimeForm from "@/components/form/FormHeader";
import { usePhotoLoader } from "@/context/PhotoLoaderContext";
import { AnimatePresence } from "framer-motion";
import SidebarGallery from "./SidebarGallery.comp";
import SidebarTutorialMob from "./SidebarTuTMob.comp";
import NothingFound from "./NothingFound.comp";
import SidebarTutorial from "./SidebarTutDesktop.comp";
import {
  HashLoader,
  BeatLoader,
  BarLoader,
  RiseLoader,
  ClockLoader,
} from "react-spinners";
export default function MapSidebar() {
  const { stateOfAction, photos } = usePhotoLoader();
  const LoaderThing = () => {
    return (
      <div className="w-full h-full bg-eu-primary/80 absolute z-[200]  flex items-center justify-center">
        <HashLoader color="yellow" />
      </div>
    );
  };
  return (
    <div className="w-full  flex-col  flex relative ">
      <header className="w-full    pointer-events-auto bg-eu-primary sticky top-0 z-50 ">
        <DateAndTimeForm />
      </header>

      <AnimatePresence mode="wait">
        {stateOfAction === "loading" ? (
          <LoaderThing />
        ) : // LoaderThing()
        stateOfAction === "loaded" && photos.length > 0 ? (
          <SidebarGallery />
        ) : stateOfAction === "loaded" && photos.length === 0 ? (
          <NothingFound />
        ) : (
          <SidebarTutorial key={"sidebartutorialkeybro"} />
        )}
      </AnimatePresence>
    </div>
  );
}
