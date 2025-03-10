import DateAndTimeForm from "@/components/form/FormHeader";
import Sidebartutorial from "./PSA.comp";
import SidebarGallery from "./SidebarGallery.comp";
import { usePhotoLoader } from "@/context/PhotoLoaderContext";
import { AnimatePresence, motion } from "framer-motion";
// type Props = {
//   photos: Photo_Location_Client[];
// };

// <DateAndTimeForm />

export default function MapSidebar() {
  const { stateOfAction } = usePhotoLoader();
  return (
    <div className="w-full  flex-col -400 flex">
      <header className="w-full    pointer-events-auto bg-gray-800 sticky top-0 z-50 ">
        <DateAndTimeForm />
      </header>

      <AnimatePresence mode="wait">
        {stateOfAction === "loaded" ? (
          <SidebarGallery />
        ) : (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              scale: 0.75,
              opacity: 0.24,
              transition: {
                ease: "backIn",
                duration: 0.57,
              },
            }}
            key={"uniquekey1"}
            className="hidden relative sm:flex w-full flex-1  bg-[#222831]"
          >
            <Sidebartutorial />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
