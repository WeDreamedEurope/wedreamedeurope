import { useEffect, useState, useRef } from "react";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  progressColor?: string;
  showPercentage?: boolean;
  animationDuration?: number;
}

export default function CircularProgress({
  progress,
  size = 100,
  strokeWidth = 10,
  backgroundColor = "#f3f4f6",
  progressColor = "#3b82f6",
  showPercentage = true,
  animationDuration = 1000,
}: CircularProgressProps) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const circleRef = useRef<SVGCircleElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(progress);
    }, 100); // Small delay to ensure the animation runs on initial render

    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    if (circleRef.current) {
      const offset = circumference - (currentProgress / 100) * circumference;
      circleRef.current.style.strokeDashoffset = offset.toString();
    }
  }, [currentProgress, circumference]);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="progressbar"
      aria-valuenow={currentProgress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          fill="none"
          style={{
            transition: `stroke-dashoffset ${animationDuration}ms ease-in-out`,
          }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold">{`${Math.round(
            currentProgress
          )}%`}</span>
        </div>
      )}
    </div>
  );
}
