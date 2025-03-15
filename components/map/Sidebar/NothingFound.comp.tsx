import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ImageMinusIcon, MapIcon, TriangleAlert } from "lucide-react";
import { useEffect } from "react";

const NothingFoundDesktop = () => {
  return (
    <div className=" animate-in zoom-in-95 hidden sm:flex w-full h-full pointer-events-auto  items-center px-4   flex-col text-red-800 font-semibold z-[200]">
      <div className=" translate-y-1/2 max-w-md gap-6  bg-red-300 flex flex-col items-center justify-center w-full rounded-md p-2 text-sm aspect-video">
        <div>
          <TriangleAlert size={64} className="text-red-800" />
        </div>
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-lg font-bold">ფოტოები არ მოიძებნა</h2>
          აირჩიეთ ახალი ლოკაცია, თარიღი ან დრო
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
      transition={{
        duration: 0.45,
        ease: "easeIn",
      }}
      className="w-full flex sm:hidden relative px-4  py-2"
    >
      <div className="bg-red-600 border-2 border-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="bg-white rounded-full p-2 flex-shrink-0">
            <TriangleAlert size={24} className="text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">
              ფოტოები არ მოიძებნა
            </h3>
            <p className="text-white text-opacity-90 text-sm">
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
