import { Photo_Location_Select_With_URL } from "@/API_CALLS/gis_query";
import Slideshow from "@/components/Slideshow";
import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

export default function Test() {
  const tempSlides = useRef<Photo_Location_Select_With_URL[]>([
    {
      id: 1,
      url: "https://picsum.photos/200/300",
      locationTakenAt: [2, 3],
      dateTakenAt: "2021-01-01",
      photoId: "1",
      userId: "1",
    },
    {
      id: 2,
      url: "https://picsum.photos/200/300",
      locationTakenAt: [2, 3],
      dateTakenAt: "2021-01-02",
      photoId: "2",
      userId: "2",
    },
    {
      id: 3,
      url: "https://picsum.photos/200/300",
      locationTakenAt: [2, 3],
      dateTakenAt: "2021-01-03",
      photoId: "3",
      userId: "3",
    },
    {
      id: 4,
      url: "https://picsum.photos/200/300",
      locationTakenAt: [2, 3],
      dateTakenAt: "2021-01-04",
      photoId: "4",
      userId: "3",
    },
  ]);

  const [showSlideshow, setShowSlideshow] = useState(false);

  return (
    <div className="w-full h-full  max-w-6xl mx-auto items-center justify-center flex flex-col relative">
      <button
        className="bg-[#00B2CA] h-10 px-6 rounded-md"
        onClick={() => setShowSlideshow(true)}
      >
        Show Slideshow
      </button>
      {showSlideshow && (
        <AnimatePresence>
          <Slideshow
            key={"dwdwdwd"}
            slides={tempSlides.current}
            onDismiss={() => setShowSlideshow(false)}
          />
        </AnimatePresence>
      )}
    </div>
  );
}
