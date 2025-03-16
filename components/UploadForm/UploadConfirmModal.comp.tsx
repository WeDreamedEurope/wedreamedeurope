import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { UploadCloudIcon } from "lucide-react";

export default function UploadConfirmModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogOverlay className=" animate-in fade-in-0 duration-200 bg-eu-primary fixed inset-0 z-[40] w-full h-full " />
      <DialogContent className="w-full h-full  flex fixed inset-0 z-40 items-center justify-center">
        <VisuallyHidden>
          <DialogTitle>Slideshow</DialogTitle>
          <DialogDescription>Some Description</DialogDescription>
        </VisuallyHidden>
        <article className=" animate-in fade-in-0 zoom-in-90 duration-200 w-full sm:w-[400px]  flex flex-col p-6 bg-[#333b2a] rounded-lg select-none">
          <div className="flex flex-col gap-2 items-center">
            <UploadCloudIcon className="w-20 h-20" />
            <p className="text-lg font-bold">ფოტოები ატვირთულია</p>
          </div>
          <footer className="flex flex-col gap-2 mt-6">
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className=" text-white px-4 py-2 rounded-lg border border-[#889275]"
            >
              ახალი ფოტოების ატვირთვა
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className=" text-white px-4 py-2 rounded-lg bg-black"
            >
              პროფილზე გადასვლა
            </button>
          </footer>
        </article>
      </DialogContent>
    </Dialog>
  );
}
