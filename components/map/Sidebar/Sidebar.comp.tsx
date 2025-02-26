import { Photo_Location_Select } from "@/server/gis_query";
import Image from "next/image";
import { Button } from "../../ui/button";
import testImage from "@/public/someimage.jpg";
import { useMapContext } from "@/context/MapContenxt";
import Sidebartutorial from "./PSA.comp";

type Props = {
  photos: Photo_Location_Select[];
};

const SidebarGallery = ({ photos }: Props) => {
  const { setSelectedPointId } = useMapContext();

  return (
    <article className="w-full grid grid-cols-2 bg-black p-4 lg:w-[60%] place-content-start gap-2 overflow-auto pb-32">
      {photos.map((i, index) => (
        <div
          onClick={() => setSelectedPointId(index.toString())}
          key={index}
          className="w-full aspect-video flex flex-col relative border border-gray-600 hover:cursor-pointer "
        >
          <div className="relative  w-full aspect-video">
            <Image src={testImage} fill alt="" className="object-cover" />
          </div>
          <div className="text-gray-300 font-semibold text-sm px-2 py-2  flex items-center justify-between ">
            <div>27.12.1986</div>
            <div>~ 4 მეტრში</div>
            <div>
              <Button size={"sm"}>რუკაზე ნახვა</Button>
            </div>
          </div>
        </div>
      ))}
    </article>
  );
};

export default function MapSidebar({ photos }: Props) {
  return (
    <>
      <Sidebartutorial />
    </>
  );
}
