import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ImageMinusIcon, MapIcon, TriangleAlert } from "lucide-react";
import { useEffect } from "react";

const NothingFoundDesktop = () => {
  return (
    <div className=" hidden sm:flex w-full h-full pointer-events-auto  items-center px-4   flex-col text-red-800 font-semibold bg-gray-800 z-[200]">
      <div className=" translate-y-1/2 max-w-md gap-6  bg-red-300 flex flex-col items-center justify-center w-full rounded-md p-2 text-sm aspect-video">
        <div>
          <TriangleAlert size={64} className="text-red-800" />
        </div>
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-lg font-bold">ფოტოები არ მოიძებნა</h2>
          მოცემული დროით მოცემულ ლოკაციაზე ფოტოები არ მოიძებნა
        </div>
      </div>
      <div className="mt-4"></div>
    </div>
  );
};

const NothingFoundMobile = () => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="w-full flex sm:hidden relative px-4  py-2"
    >
      <div className="bg-red-600 border-2 border-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="bg-white rounded-full p-2 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">
              ფოტოები არ მოიძებნა
            </h3>
            <p className="text-white text-opacity-90">
              ცადეთ ახალი ლოკაცია, თარიღი ან დრო
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default function NothingFound() {
  return (
    <>
      <NothingFoundMobile />
      <NothingFoundDesktop />
    </>
  );
}
