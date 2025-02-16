import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

const ProgressScreen = ({ percent }: { percent: number }) => {
  const clampedProgress = Math.min(Math.max(percent, 0), 100);
  const progressMotionValue = useMotionValue(clampedProgress);
  const springProgress = useSpring(progressMotionValue, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  useEffect(() => {
    progressMotionValue.set(clampedProgress);
  }, [clampedProgress, progressMotionValue]);

  const width = useTransform(springProgress, (val) => `${val}%`);
  const displayProgress = useTransform(
    springProgress,
    (value) => `${Math.round(value)}%`
  );

  const textColor = useTransform(
    springProgress,
    [0, 50, 100],
    ["#000000", "#000000", "#ffffff"]
  );
  return (
    <motion.div className="w-full max-w-md mx-auto absolute  h-full z-50">
      <motion.div
        initial={{ width: "0%" }}
        animate={{
          width: "100%",
          transition: {
            duration: 0.73,
          },
        }}
        className="relative  bg-gray-200  overflow-hidden h-full"
      >
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{ width }}
        />
        <AnimatePresence>
          {clampedProgress > 0 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center font-bold text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: textColor }}
            >
              {displayProgress}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ProgressScreen;
