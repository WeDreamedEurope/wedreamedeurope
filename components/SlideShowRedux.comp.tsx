import { Photo_Location_Select_With_URL } from "@/API_CALLS/gis_query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronRightIcon } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import styles from "./Slideshow.module.css";
import { ChevronLeftIcon } from "lucide-react";

type SlideShowReduxProps = {
  //   photos: Photo_Location_Select_With_URL[];
  isOpen: boolean;
  onDismiss: () => void;
  photos: Photo_Location_Select_With_URL[];
};

export default function SlideShowRedux({
  isOpen,
  onDismiss,
  photos,
}: SlideShowReduxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);
  const slidesContainerRef = useRef<HTMLDivElement>(null);

  const handlePrevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      slidesContainerRef.current?.scrollTo({
        left: (currentIndex - 1) * window.innerWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNextSlide = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      slidesContainerRef.current?.scrollTo({
        left: (currentIndex + 1) * window.innerWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onDismiss}>
      <DialogOverlay className="fixed inset-0 bg-eu-primary z-40 animate-in slide-in-from-top-4 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-4 data-[state=closed]:animate-out data-[state=closed]:fade-out duration-1000 " />
      <DialogContent className=" w-full h-full border  top-0 left-0 z-40 overflow-hidden fixed  flex">
        <VisuallyHidden>
          <DialogTitle>SlideShow</DialogTitle>
          <DialogDescription>some description</DialogDescription>
        </VisuallyHidden>
        <div tabIndex={0} className={styles.slidesContainer}>
          {photos.map((slide) => (
            <div key={slide.id} className={styles.slideWrapper}>
              <img
                src={slide.url}
                alt={slide.photoId}
                className={styles.slideImage}
              />
              <div className={styles.slideInfo}>
                <div className="flex flex-col gap-2">
                  <p className="text-xl text-white">{slide.dateTakenAt}</p>
                  <h2 className="">{slide.photoId}</h2>
                </div>
                <a href={slide.url} download className={styles.downloadButton}>
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handlePrevSlide}
          disabled={currentIndex === 0}
          className={`${styles.navigationButton} ${styles.prevButton}`}
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={handleNextSlide}
          disabled={currentIndex === photos.length - 1}
          className={`${styles.navigationButton} ${styles.nextButton}`}
        >
          <ChevronRightIcon />
        </button>
      </DialogContent>
    </Dialog>
  );
}
