import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Photo_Location_Insert } from "@/API_CALLS/gis_query";
import { CollectPhotoMetaData } from "@/API_CALLS/user/user.server";
import { format } from "date-fns";
import { ka } from "date-fns/locale";
import exifr from "exifr";
import { motion } from "framer-motion";
import { CheckCircleIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import UploadPSA from "../form/UploadPSA.comp";
import UploadForm from "./UploadForm.comp";
import UploadConfirmModal from "./UploadConfirmModal.comp";
// const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB per file
// const CHUNK_SIZE = 750 * 1024; // 750KB chunks
type ImageMeta = {
  url: string;
  name: string;
  DateTaken: string;
  location: [number, number] | null;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
};

const DissmisedFilesPSA = ({ shouldDisplay }: { shouldDisplay: boolean }) => {
  return (
    shouldDisplay && (
      <article className=" w-full animate-in absolute slide-in-from-top-7 bg-red-300 text-red-800 rounded-xl p-2 text-xs font-semibold">
        ფაილი უარყოფილია EXIF მონაცემების არ არსებობის გამო
      </article>
    )
  );
};

export default function SimpleImageUploader({ userId }: { userId: string }) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dismissedFiles, setDismissedFiles] = useState<File[]>([]);
  const [localPreviewUrls, setLocalPreviewUrls] = useState<ImageMeta[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [internalState, setInternalState] = useState<
    "idle" | "selected" | "uploading" | "success" | "error"
  >("idle");

  const router = useRouter();

  const processFiles = async (files: FileList) => {
    const newPreviewUrls = new Array<ImageMeta>();
    const okayFiles = new Array<File>();
    const wrongFiles = new Array<File>();

    for (const file of files) {
      try {
        const EXIFData = await exifr.parse(file, [
          "DateTimeOriginal",
          "GPSLatitude",
          "GPSLongitude",
        ]);

        if (
          EXIFData &&
          EXIFData.longitude &&
          EXIFData.longitude &&
          EXIFData.DateTimeOriginal
        ) {
          const {
            DateTimeOriginal,
            GPSLatitude,
            GPSLongitude,
            latitude,
            longitude,
          } = EXIFData;

          okayFiles.push(file);
          newPreviewUrls.push({
            url: URL.createObjectURL(file),
            name: file.name,
            DateTaken: new Date(DateTimeOriginal).toISOString(),
            location:
              GPSLatitude && GPSLongitude ? [longitude, latitude] : null,
            progress: 0,
            status: "idle",
          });
        } else {
          wrongFiles.push(file);
        }
      } catch (error) {
        console.error("Error parsing EXIF:", error);
      }
    }

    if (newPreviewUrls.length > 0) setInternalState("selected");
    setLocalPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setSelectedFiles((prev) => [...prev, ...okayFiles]);
    setDismissedFiles((prev) => [...prev, ...wrongFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(localPreviewUrls[index].url);
    setLocalPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStatus = (
    index: number,
    newStatus: "success" | "error" | "idle" | "uploading"
  ) => {
    setLocalPreviewUrls((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, status: newStatus } : file
      )
    );
  };

  const singleImageUpload = async (file: File, index: number) => {
    updateStatus(index, "uploading");
    // This is where we get the presigned url
    const urlResponse = await fetch("/api/presign", {
      method: "POST",
      body: JSON.stringify({
        fileName: file.name.replace(/\s+/g, "_"),
        fileType: file.type,
        userID: userId,
      }),
    });

    const signedUrl = await urlResponse.json();

    console.log(`Key We Will Be Sending`,file.name.replace(/\s+/g, "_"))

    if (signedUrl && typeof signedUrl === "string") {
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
          "Origin": window.location.origin,
          "Content-Disposition": `inline; filename="${file.name.replace(/\s+/g, "_")}"`,

        },
      });

      if (uploadResponse.ok && uploadResponse.status == 200) {
        updateStatus(index, "success");
        return Promise.resolve(file.name.replace(/\s+/g, "_"));
      } else {
        updateStatus(index, "error");
        return Promise.reject();
      }
    }
  };

  const betterUpload = async () => {
    setInternalState("uploading");
    const PromisedUploades = selectedFiles.map((file, index) =>
      singleImageUpload(file, index)
    );

    const results = await Promise.allSettled(PromisedUploades);

    const metaData = results
      .filter((res) => res.status == "fulfilled")
      .map((res) => extractMetaData(res.value!));

    await CollectPhotoMetaData(metaData);
    setInternalState("success");
    setIsOpen(true);
  };

  const extractMetaData = (fileName: string): Photo_Location_Insert => {
    const fromPreviewUrls = localPreviewUrls.find(
      (prev) => prev.name == fileName
    );
    if (!fromPreviewUrls) throw new Error("File Not Found");
    return {
      userId: userId,
      locationTakenAt: fromPreviewUrls.location!,
      photoId: fromPreviewUrls.name,
      dateTakenAt: fromPreviewUrls.DateTaken!,
    };
  };

  const getIcon = (index: number) => {
    if (localPreviewUrls[index].status == "success") {
      return <CheckCircleIcon className="text-green-300" />;
    } else if (localPreviewUrls[index].status == "uploading") {
      return <ClipLoader size={24} color="yellow" speedMultiplier={0.25} />;
    } else {
      return (
        <Trash2Icon
          className="hover:text-red-300"
          onClick={() => handleRemoveFile(index)}
        />
      );
    }
  };


  const handleModalClose = (arg: "new" | "profile") => {
    if (arg == "new") {
      localPreviewUrls.forEach((file) => {
        URL.revokeObjectURL(file.url);
      });
      
      setInternalState("idle");
      setSelectedFiles([]);
      setLocalPreviewUrls([]);
      setDismissedFiles([]);
      setIsOpen(false);
    } else if (arg == "profile") {
      router.push("/profile");
    }
  };
  return (
    <div className="w-full   max-w-2xl  sm:mx-auto    relative mx-0    h-auto flex-1       flex flex-col px-2  ">
      <DissmisedFilesPSA shouldDisplay={dismissedFiles.length > 0} />
      <UploadForm onFileDropped={processFiles} processFiles={processFiles} />
      <UploadConfirmModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClose={handleModalClose}
      />
      <section className="flex-grow ">
        <UploadPSA shouldDisplay={localPreviewUrls.length === 0} />
        <div className="grid grid-flow-row-dense  gap-4 mt-4 items-start justify-start px-3     ">
          {localPreviewUrls.map(({ name, url, DateTaken }, index) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 1.2,
                },
              }}
              key={index}
              className="  relative min-w-full     flex    items-center gap-2     overflow-hidden  border border-gray-800 "
            >
              <img
                src={url}
                alt={name}
                className="object-cover  aspect-square w-[20%]  flex-shrink"
              />

              <div className="flex-grow text-gray-300  flex items-center  ">
                <div className="space-y-2">
                  <div className="text-xs line-clamp-1">{name}</div>
                  <div className="flex gap-4 items-center">
                    <div className="flex text-[10px]">
                      {format(DateTaken!, "d MMM, HH:mm", { locale: ka })}
                    </div>
                    {/* <div className="text-[10px] font-semibold text-blue-400">
                      {status}
                    </div> */}
                  </div>
                </div>
              </div>
              <button className="mr-4">{getIcon(index)}</button>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="sticky bottom-0 left-0 max-w-2xl  w-full px-4 py-2 flex justify-center z-30  items-center bg-[#181c14] ">
        <Button
          onClick={() => {
            betterUpload();
          }}
          disabled={selectedFiles.length === 0 || internalState === "uploading"}
          variant={"default"}
          size={"lg"}
          className={cn(
            "w-full disabled:cursor-not-allowed disabled:opacity-20 relative transition-all bg-green-800  hover:bg-green-700 ",
            {
              "bg-yellow-700 cursor-not-allowed  ":
                internalState === "uploading",
            }
          )}
        >
          <span
            className={`${
              internalState === "uploading" ? "animate-pulse" : ""
            }`}
          >
            ატვირთვა {selectedFiles.length} ფაილი
          </span>
        </Button>
      </footer>
    </div>
  );
}

// ]4nPjB+E24_1
