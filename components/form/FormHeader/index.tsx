import { usePhotoLoader } from "@/context/PhotoLoaderContext";
import FomrHeaderDesktop from "./FormHeader.deskt.comp";
import FormHeaderMob from "./FormHeaderMob.comp";

export type FormHeaderProps = {
  readyForLoad: boolean;
  doSearch: () => void;
};

export default function DateAndTimeForm() {
  const { readyForLoad, loadPhotos } = usePhotoLoader();
  return (
    <>
      <FomrHeaderDesktop readyForLoad={readyForLoad} doSearch={loadPhotos} />
      <FormHeaderMob readyForLoad={readyForLoad} doSearch={loadPhotos} />
    </>
  );
}
