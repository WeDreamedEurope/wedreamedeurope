import React, { useState, useRef, useEffect, FC } from "react";
import styles from "./Slideshow.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Photo_Location_Select_With_URL } from "@/API_CALLS/gis_query";
import {
  Root,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface SlideshowProps {
  slides: Photo_Location_Select_With_URL[];
  isOpen: boolean;
  onDismiss: () => void;
  startingIndex?: number;
}

const Slideshow: FC<SlideshowProps> = ({
  slides,
  onDismiss,
  isOpen,
  startingIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      slidesContainerRef.current?.scrollTo({
        left: (currentIndex + 1) * window.innerWidth,
        behavior: "smooth",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        handlePrevSlide();
        break;
      case "ArrowRight":
        handleNextSlide();
        break;
      case "Escape":
        onDismiss();
        break;
      default:
        break;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setStartX(e.pageX - (slidesContainerRef.current?.offsetLeft || 0));
    setScrollLeft(slidesContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (slidesContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (slidesContainerRef.current) {
      slidesContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScroll = () => {
    if (slidesContainerRef.current) {
      const newIndex = Math.round(
        slidesContainerRef.current.scrollLeft / window.innerWidth
      );
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = slidesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Focus the container when component mounts
      container.focus();
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    // <Dialog open={isOpen} onOpenChange={onDismiss}>
    //   <DialogOverlay className="fixed inset-0 bg-purple-900 z-40 animate-in fade-in data-[state=open]:animate-in data-[state=open]:fade-in-15 data-[state=closed]:animate-out data-[state=closed]:fade-out duration-1000 " />
    //   <DialogContent
    //     onEscapeKeyDown={onDismiss}
    //     onPointerDownOutside={(e) => {
    //       e.preventDefault();
    //     }}
    //     className="min-w-full min-h-full bg-red-300  z-40 fixed inset-0 flex items-center justify-center px-4 "
    //   >
    //     <article className="flex flex-col gap-4 text-white w-full h-full  bg-green-500 " >
    //       <VisuallyHidden>
    //         <DialogTitle asChild>
    //           <h1>Slideshow</h1>
    //         </DialogTitle>
    //         <DialogDescription>I Am Description</DialogDescription>
    //       </VisuallyHidden>
          
    //         <img src={slides[currentIndex].url} alt={slides[currentIndex].photoId} className="w-full h-full object-cover" />
          
    //     </article>
    //   </DialogContent>
    // </Dialog>

    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.6,
      }}
      exit={{
        y: 100,
      }}
      className={styles.container}
    >
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={styles.slidesContainer}
        ref={slidesContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {slides.map((slide) => (
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
        disabled={currentIndex === slides.length - 1}
        className={`${styles.navigationButton} ${styles.nextButton}`}
      >
        <ChevronRightIcon />
      </button>
    </motion.div>
  );
};

export default Slideshow;
