import { Photo_Location_Select_With_URL } from "@/API_CALLS/gis_query";
import Slideshow from "@/components/Slideshow";
import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const AnimatedDialog = () => {
  return (
    <Dialog.Root>
      {/* Trigger Button */}
      <Dialog.Trigger className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Open Dialog
      </Dialog.Trigger>

      {/* Dialog Portal */}
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="animate-in fade-in fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />

        {/* Content */}
        <Dialog.Content className="animate-in zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold">
            Dialog Title
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mt-2">
            This is a description of the dialog content.
          </Dialog.Description>

          {/* Close Button */}
          <Dialog.Close className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default function Test() {
  const [showSlideshow, setShowSlideshow] = useState(false);

  return (
    <div className="w-full h-full  max-w-6xl mx-auto items-center justify-center flex flex-col relative">
      <AnimatedDialog   />
    </div>
  );
}
