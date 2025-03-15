import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContenxt";
import { usePhotoLoader } from "@/context/PhotoLoaderContext";
import { motion } from "framer-motion";
import { ImageMinusIcon, MapIcon } from "lucide-react";
import Image from "next/image";
const tempShit =
  "https://images.unsplash.com/photo-1485056981035-7a565c03c6aa?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const NoPhotosFound = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="w-full h-full pointer-events-auto flex items-center px-4 justify-center flex-col text-gray-300 font-semibold bg-gray-800 z-[200]">
      <div className=" max-w-md gap-6  bg-yellow-800 flex flex-col items-center justify-center w-full rounded-md p-2 text-sm aspect-video">
        <div>
          <ImageMinusIcon size={64} className="text-red-200" />
        </div>
        <div className="text-center">
          მოცემული დროით მოცემულ ლოკაციაზე ფოტოები არ მოიძებნა
        </div>
      </div>
      <div className="mt-4">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          size={"lg"}
          className=""
          variant={"secondary"}
        >
          <MapIcon /> რუკის ჩვენება
        </Button>
      </div>
    </div>
  );
};

// const SidebarGallery = () => {
//   const { setSelectedPointId } = useMapContext();

//   const { photos, setStateOfAction } = usePhotoLoader();

//   const RenderGallery = () => {
//     return (
//       <>
//         {photos.map((i, index) => (
//           <div
//             onClick={() => setSelectedPointId(index.toString())}
//             key={index}
//             className="min-w-full h-auto flex flex-col relative sm:border-gray-600 hover:cursor-pointer text-red-300 bg-[#202127] overflow-hidden rounded-md"
//           >
//             <div className="relative w-full aspect-video min-w-full">
//               <Image src={tempShit} fill alt="" className="object-cover" />
//             </div>
//             <div className="text-[#9494bf] font-semibold text-sm px-2 py-2 flex items-center justify-between">
//               <div>{i.dateTakenAt}</div>
//               <div>~ {i.distance.toFixed(2)}მ</div>
//               <div>
//                 <Button size={"sm"}>რუკაზე ნახვა</Button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </>
//     );
//   };

//   return (
//     <article className="w-full relative sm:grid sm:grid-flow-row sm:grid-cols-2 h-auto flex-grow  p-0  place-content-start gap-2 py-5 pointer-events-auto sm:pb-32 text-gray-900 bg-[#121212] space-y-3 px-2">
//       {photos.length > 0 ? (
//         <RenderGallery />
//       ) : (
//         <NoPhotosFound onClick={() => setStateOfAction("idle")} />
//       )}
//     </article>
//   );
// };

function SidebarGallery() {
  const { setSelectedPointId } = useMapContext();
  const { photos, setStateOfAction } = usePhotoLoader();
  const RenderGallery = () => {
    return (
      <div className="w-full relative sm:grid sm:grid-flow-row sm:grid-cols-2  flex-grow h-auto  p-0  place-content-start gap-2 py-5 pointer-events-auto  text-gray-900 bg-[#121212]  px-2 ">
        {photos.map((i, index) => (
          <div
            onClick={() => setSelectedPointId(index.toString())}
            key={index}
            className="min-w-full h-auto flex flex-col relative sm:border-gray-600 hover:cursor-pointer text-red-300 bg-[#202127] overflow-hidden rounded-md"
          >
            <div className="relative w-full aspect-video min-w-full">
              <Image src={tempShit} fill alt="" className="object-cover" />
            </div>
            <div className="text-[#9494bf] font-semibold text-sm px-2 py-2 flex items-center justify-between">
              <div>{i.dateTakenAt}</div>
              <div>~ {i.distance.toFixed(2)}მ</div>
              <div>
                <Button size={"sm"}>რუკაზე ნახვა</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <motion.div
      key={"uniqueKey111111"}
      initial={{
        y: 100,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: 200,
        opacity: 0,
        transition: {
          y: {
            duration: 0.37,
            ease: "easeIn",
          },
          opacity: {
            duration: 0.37,
            delay: 0.35,
            ease: "easeIn",
          },
        },
      }}
      transition={{
        duration: 0.47,
        ease: "easeIn",
      }}
      className="w-full h-full overflow-auto "
    >
      {photos.length === 0 ? (
        <NoPhotosFound onClick={() => setStateOfAction("idle")} />
      ) : (
        <RenderGallery />
      )}
    </motion.div>
  );
}

export default SidebarGallery;
