import { useMapContext } from "@/context/MapContenxt";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlertIcon } from "lucide-react";

export default function SidebarTutorialMob() {
  const { selectedLocation } = useMapContext();

  return (
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
      className=" relative sm:flex w-full flex-grow-0 sm:flex-1    sm:bg-[#222831] pointer-events-auto"
    >
      <motion.div
        layout
        key={"blablabla"}
        className=" w-full  mx-auto max-w-sm  mt-4 flex  flex-col gap-4  px-4 "
      >
        <AnimatePresence initial={false}>
          {!selectedLocation && (
            <motion.div
              key={"wdwdwd"}
              exit={{
                backgroundColor: "green",
                x: 800,
                transition: {
                  x: {
                    duration: 1.2,
                    delay: 0.5,
                    ease: "backInOut",
                  },
                  backgroundColor: {
                    duration: 0.75,
                    ease: "easeIn",
                  },
                },
              }}
              className="flex gap-1 items-center  text-yellow-200 bg-black/80 rounded-xl p-4"
            >
              <TriangleAlertIcon size={18} />
              მონიშნეთ სასურველი ლოკაცია
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* <Sidebartutorial /> */}
    </motion.div>
  );
}
