import DateAndTimeForm from "@/components/form/FormHeader";
import usePhotoLoader from "@/hooks/usePhotoloader.hook";
import Sidebartutorial from "./PSA.comp";
import SidebarGallery from "./SidebarGallery.comp";
// type Props = {
//   photos: Photo_Location_Client[];
// };

// <DateAndTimeForm />
export default function MapSidebar() {
  const { stateOfAction, tempHandlerOrWhatever, photos } = usePhotoLoader();
  return (
    <div className="w-full  flex-col bg-red-400 flex">
      <header className="w-full    pointer-events-auto bg-gray-800 sticky top-0 z-50 ">
        <DateAndTimeForm />
      </header>
      <div onClick={() => tempHandlerOrWhatever()}>{stateOfAction}</div>
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
