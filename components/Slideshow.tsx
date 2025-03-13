import React, { useState, useRef, useEffect } from "react";
import styles from "./Slideshow.module.css";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface Slide {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
  downloadUrl: string;
}

interface SlideshowProps {
  slides: Slide[];
}

const Slideshow: React.FC<SlideshowProps> = ({ slides }) => {
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
    console.log("next slide");
    console.log(currentIndex);
    console.log(slides.length);
    if (currentIndex < slides.length - 1) {
      console.log(`We Should Slide!`)
      console.log((currentIndex + 1) * window.innerWidth)
      setCurrentIndex(currentIndex + 1);
      slidesContainerRef.current?.scrollTo({
        left: (currentIndex + 1) * window.innerWidth,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // if (e.button !== 0) return;
    // setIsDragging(true);
    // setStartX(e.pageX - (slidesContainerRef.current?.offsetLeft || 0));
    // setScrollLeft(slidesContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // if (!isDragging) return;
    // e.preventDefault();
    // const x = e.pageX - (slidesContainerRef.current?.offsetLeft || 0);
    // const walk = (x - startX) * 2;
    // if (slidesContainerRef.current) {
    //   slidesContainerRef.current.scrollLeft = scrollLeft - walk;
    // }
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
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    // <section
    //   ref={slidesContainerRef}
    //   onMouseDown={handleMouseDown}
    //   onMouseMove={handleMouseMove}
    //   onMouseUp={handleMouseUp}
    //   onMouseLeave={handleMouseUp}
    //   className="w-full h-full relative border bg-orange-300  snap-x snap-mandatory scroll-smooth "
    // >
    //   {slides.map((slide) => (
    //     <div key={slide.id} className="w-full h-full snap-start relative flex items-center justify-center">
    //       <img
    //         src={slide.imageUrl}
    //         alt={slide.title}
    //         className="w-full h-full object-cover"
    //       />
    //     </div>
    //   ))}
    //   <button className="bg-blue-500 absolute  top-1/2 -translate-y-1/2 left-1 w-12 h-12 rounded-full flex items-center justify-center">
    //     <ChevronLeftIcon className="w-6 h-6" />
    //   </button>
    //   <button
    //     onClick={handleNextSlide}
    //     className="bg-blue-500 absolute  top-1/2 -translate-y-1/2 right-1 w-12 h-12 rounded-full flex items-center justify-center"
    //   >
    //     <ChevronRightIcon className="w-6 h-6" />
    //   </button>
    //   <footer className="w-full h-12 bg-red-500 absolute bottom-0 left-0 right-0"></footer>
    // </section>

    <div className={styles.container}>
      <div
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
              <h2 className={styles.slideTitle}>{slide.title}</h2>
              <p className={styles.slideDate}>{slide.date}</p>
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
        ←
      </button>
      <button
        onClick={handleNextSlide}
        disabled={currentIndex === slides.length - 1}
        className={`${styles.navigationButton} ${styles.nextButton}`}
      >
        →
      </button>
    </div>
  );
};

export default Slideshow;
