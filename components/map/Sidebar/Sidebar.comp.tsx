import DateAndTimeForm from "@/components/form/FormHeader";
import Sidebartutorial from "./PSA.comp";
import SidebarGallery from "./SidebarGallery.comp";
import { usePhotoLoader } from "@/context/PhotoLoaderContext";
// type Props = {
//   photos: Photo_Location_Client[];
// };

// <DateAndTimeForm />
export default function MapSidebar() {
  const { stateOfAction } = usePhotoLoader();
  return (
    <div className="w-full  flex-col -400 flex">
      <header className="w-full    pointer-events-auto bg-gray-800 sticky top-0 z-50 ">
        <DateAndTimeForm />
      </header>
      
      {stateOfAction === "loaded" ? (
        <SidebarGallery />
      ) : (
        <div className="hidden relative sm:flex w-full flex-1  bg-[#222831]">
          <Sidebartutorial />
        </div>
      )}
    </div>
  );
}
