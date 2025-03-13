import React, { useState, useRef, useEffect } from "react";
import styles from "./Slideshow.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Slide {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
  downloadUrl: string;
}

interface SlideshowProps {
  slides: Slide[];
  onDismiss: () => void;
  startingIndex?:number
}

const Slideshow: React.FC<SlideshowProps> = ({ slides, onDismiss, startingIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(startingIndex);
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
        y:100
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
              src={slide.imageUrl}
              alt={slide.title}
              className={styles.slideImage}
            />
            <div className={styles.slideInfo}>
              <div className="flex flex-col gap-2">
                <p className="text-xl text-white">{slide.date}</p>
                <h2 className="">{slide.title}</h2>
              </div>
              <a
                href={slide.downloadUrl}
                download
                className={styles.downloadButton}
              >
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
