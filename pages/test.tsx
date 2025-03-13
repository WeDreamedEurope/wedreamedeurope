import Slideshow from "@/components/Slideshow";
import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

export default function Test() {
  const tempSlides = useRef(
    Array(10)
      .fill(null)
      .map((e, index) => ({
        id: index,
        imageUrl: `https://images.unsplash.com/photo-1485056981035-7a565c03c6aa?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
        title: "Beautiful Sunset",
        date: "March 15, 2024",
        downloadUrl: `https://images.unsplash.com/photo-1485056981035-7a565c03c6aa?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      }))
  );

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
