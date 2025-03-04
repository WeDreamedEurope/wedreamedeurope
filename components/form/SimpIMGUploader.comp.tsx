import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ka } from "date-fns/locale";
import exifr from "exifr";
import { motion } from "framer-motion";
import { CheckCircleIcon, Trash2Icon, Upload } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import UploadPSA from "./UploadPSA.comp";
// const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB per file
// const CHUNK_SIZE = 750 * 1024; // 750KB chunks
type ImageMeta = {
  url: string;
  name: string;
  DateTaken: Date | null;
  location: [number, number] | null;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
};

export default function SimpleImageUploader({ userId }: { userId: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dismissedFiles, setDismissedFiles] = useState<File[]>([]);
  const [localPreviewUrls, setLocalPreviewUrls] = useState<ImageMeta[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [internalState, setInternalState] = useState<
    "idle" | "selected" | "uploading" | "success" | "error"
  >("idle");

  const processFiles = async (files: FileList) => {
    console.log("processing file");
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

        if (EXIFData && EXIFData.longitude && EXIFData.longitude) {
          console.log(EXIFData);
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
            DateTaken: DateTimeOriginal || null,
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

  const handleFileSelect = (event: ChangeEvent) => {
    const filez = (event.target as HTMLInputElement).files;
    if (!filez) return;
    processFiles(filez);
  };

  const handleDragEnter = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    console.log(`Drag Enter`);
    setIsDragging(true);
  };
  const handleDragOver = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    console.log(`Drag Over`);
    setIsDragging(true);
  };
  const handleDragDrop = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(false);
    const { files } = evt.dataTransfer;
    console.log(`File Was Dropped`);
    if (files && files.length > 0) {
      processFiles(files);
    }
  };
  const handleDragLeave = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(false);
    console.log(`Drag Leave`);
    // console.log(evt.dataTransfer.files);
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
    const urlResponse = await fetch("/api/presign", {
      method: "POST",
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        userID: userId,
      }),
    });

    const signedUrl = await urlResponse.json();

    if (signedUrl && typeof signedUrl === "string") {
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      if (uploadResponse.ok && uploadResponse.status == 200) {
        updateStatus(index, "success");
        return Promise.resolve();
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
    console.log(results);
    setInternalState("success");
  };

  const getIcon = (index: number) => {
    if (localPreviewUrls[index].status == "success") {
      // return <CheckIcon size={15} className="text-green-300" />;
      return <CheckCircleIcon className="text-green-300" />;
    } else if (localPreviewUrls[index].status == "uploading") {
      return <ClipLoader size={24} color="yellow" speedMultiplier={0.25} />;
    } else {
      return <Trash2Icon onClick={() => handleRemoveFile(index)} />;
    }
  };

  return (
    <div className="w-full   max-w-2xl  sm:mx-auto  p-4  relative mx-0   overflow-auto pb-20 ">
      <input
        className="hidden"
        type="file"
        ref={inputRef}
        multiple
        onChange={handleFileSelect}
      />

      {dismissedFiles.length > 0 && (
        <article className=" bg-red-300 text-red-800 rounded-xl p-2 text-xs font-semibold">
          {dismissedFiles.length} ფაილი უარყოფილია EXIF მონაცემების არ არსებობის
          გამო
        </article>
      )}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6  transition-colors duration-300
            ${
              isDragging
                ? "border-blue-500 bg-blue-500 bg-opacity-10"
                : "border-gray-600 hover:border-gray-500"
            } 
            
            transition-all duration-200`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragDrop}
      >
        <>
          <Upload className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <label htmlFor="file-input" className="cursor-pointer">
            <span className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded inline-block mb-4">
              აირჩიეთ ფაილი
            </span>
            <input
              id="file-input"
              type="file"
              accept=".jpg,.jpeg"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
          <p className="text-gray-400">
            ან ჩააგდეთ ფაილი აქ {isDragging ? "Yes" : "NO"}
          </p>
        </>
      </div>

      <section>
        {localPreviewUrls.length === 0 && (
          <div>
            <UploadPSA />
          </div>
        )}

        <div className="grid grid-flow-row-dense  gap-4 mt-4 items-start justify-start mb-10    ">
          {localPreviewUrls.map(
            ({ name, url, DateTaken, location, progress, status }, index) => (
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
                      <div className="text-[10px] font-semibold text-blue-400">
                        {status}
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" mx-4 w-6 h-6 sm:w-8 sm:h-8">
                  {getIcon(index)}
                </div>
              </motion.div>
            )
          )}
        </div>
      </section>
      <section
        style={{
          left: "50%",
          transform: "translateX(-50%)",
        }}
        className="fixed bottom-0 left-0 max-w-2xl  w-full px-4 py-2 flex justify-center  items-center bg-transparent "
      >
        <Button
          // onClick={() => uploadImages()}
          onClick={() => betterUpload()}
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
            ატვირთვა
          </span>
        </Button>
      </section>
    </div>
  );
}

// ]4nPjB+E24_1
