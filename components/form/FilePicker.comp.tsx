import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ka } from "date-fns/locale";
import exifr from "exifr";
import { Calendar1Icon, MapPin, Trash2Icon, Upload } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import CircularProgress from "../CircularProgress.comp";
// const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB per file
const CHUNK_SIZE = 750 * 1024; // 750KB chunks
type ImageMeta = {
  url: string;
  name: string;
  DateTaken: Date | null;
  location: [number, number] | null;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
};
export default function ImagePicker() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dismissedFiles, setDismissedFiles] = useState<File[]>([]);
  const [localPreviewUrls, setLocalPreviewUrls] = useState<ImageMeta[]>([]);
  const [dragging, setDragging] = useState(false);

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
    setDragging(true);
  };
  const handleDragOver = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    console.log(`Drag Over`);
  };
  const handleDragDrop = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    setDragging(false);
    const { files } = evt.dataTransfer;

    if (files && files.length > 0) {
      processFiles(files);
    }
  };
  const handleDragLeave = (evt: DragEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    setDragging(false);
    console.log(`Drag Leave`);
    // console.log(evt.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(localPreviewUrls[index].url);
    setLocalPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File, index: number) => {
    console.log(`Starting upload for ${file.name}`);
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = Date.now().toString();
    let chunksUploaded = 0;

    updateStatus(index, "uploading");

    try {
      for (let chunk = 1; chunk <= totalChunks; chunk++) {
        const start = (chunk - 1) * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const fileChunk = file.slice(start, end);

        const formData = new FormData();
        formData.append("file", fileChunk);
        formData.append("fileId", uploadId);
        formData.append("chunkNumber", chunk.toString());
        formData.append("totalChunks", totalChunks.toString());
        formData.append("fileName", file.name);

        console.log(
          `Sending chunk ${chunk} of ${totalChunks} for ${file.name}`
        );
        const response = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Chunk upload failed: ${errorData.message || response.statusText}`
          );
        }

        chunksUploaded++;
        updateProgress(index, Math.round((chunksUploaded / totalChunks) * 100));

        // Check if this was the final chunk
        if (chunk === totalChunks) {
          const data = await response.json();
          console.log(`Upload completed for ${file.name}:`, data);
          updateStatus(index, "success");
          return data;
        }
      }
    } catch (error) {
      console.error(`Upload failed for ${file.name}:`, error);
      updateStatus(index, "error");
      throw error;
    }
  };

  const updateProgress = (index: number, newProgress: number) => {
    setLocalPreviewUrls((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, progress: newProgress } : file
      )
    );
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

  const uploadImages = async () => {
    const uploades = selectedFiles.map((file, index) =>
      uploadImage(file, index)
    );
    const results = await Promise.all(uploades);
    console.log(results);
  };

  return (
    <div className="w-full  sm:mx-auto  p-4  relative mx-0 max-w-full  overflow-auto pb-20 ">
      <input
        className="hidden"
        type="file"
        ref={inputRef}
        multiple
        onChange={handleFileSelect}
      />

      {dismissedFiles.length > 0 && (
        <article className=" bg-red-300 text-red-800 rounded-xl p-2 text-xs font-semibold">
          {dismissedFiles.length} ფაილი უარყოფილია  EXIF მონაცემების არ არსებობის გამო
        </article>
      )}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragDrop}
        onClick={() => inputRef.current?.click()}
        className={`
            ${dragging ? "border-blue-500" : "border-gray-300"}
            w-full h-48  border-dashed rounded-lg flex flex-col items-center justify-center curpser-pointer transition-colors`}
      >
        <Upload size={48} />
        <Button variant={"ghost"} className="text-blue-300 mt-4">
          მონიშნე ფოტოები
        </Button>
        <article className="flex  gap-2 text-xs text-gray-400 mt-2 opacity-70 ">
          <div> მაქსიმუმ 10MB.</div>
          <div> ფორმატი jpeg </div>
        </article>
        {/* <p className="text-gray-500 text-sm">Click to select a file</p> */}
      </div>

      <section>
        <section className="flex flex-col  items-center mt-4"></section>

        <div></div>

        <div className="grid grid-flow-row-dense sm:grid-cols-3 gap-4 mt-4 items-start justify-start mb-10    ">
          {localPreviewUrls.map(
            ({ name, url, DateTaken, location, progress, status }, index) => (
              <div
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
                        რუკაზე ნახვა
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" mx-2">
                  {status == "idle" ? (
                    <span>
                      <Trash2Icon
                        size={15}
                        onClick={() => handleRemoveFile(index)}
                      />
                    </span>
                  ) : (
                    <CircularProgress
                      progress={progress}
                      size={15}
                      showPercentage={false}
                      strokeWidth={2}
                      progressColor="#2196f3"
                      backgroundColor="#8dc0eb"
                      animationDuration={1000}
                    />
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </section>
      <section className="fixed bottom-0 left-0 w-full px-4 py-2 flex justify-center  items-center bg-black ">
        <Button
          onClick={() => {
            uploadImages();
          }}
          disabled={selectedFiles.length === 0}
          variant={"default"}
          size={"lg"}
          className="w-full disabled:cursor-not-allowed disabled:opacity-20"
        >
          Upload
        </Button>
      </section>
    </div>
  );
}
