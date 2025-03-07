import { Button } from "@/components/ui/button";
import { useMapContext } from "@/context/MapContenxt";
import usePhotoLoader from "@/hooks/usePhotoloader.hook";
import Image from "next/image";
const tempShit =
  "https://images.unsplash.com/photo-1485056981035-7a565c03c6aa?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const SidebarGallery = () => {
  const { setSelectedPointId } = useMapContext();

  const { photos } = usePhotoLoader();

  return (
    <article className="w-full relative sm:grid sm:grid-flow-row sm:grid-cols-2 h-auto flex-grow  p-0  place-content-start gap-2 py-5 pointer-events-auto sm:pb-32 text-gray-900 bg-[#121212] space-y-3 px-2">
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
    </article>
  );
};

export default SidebarGallery;
