import { ChangeEvent, useRef, useState, DragEvent } from "react";
import { Upload } from "lucide-react";
import { ImagePreviewCard } from "@/components/media/ImagePreviewCard/PreviewCard.comp";
import exifr from "exifr";
import { Button } from "@/components/ui/button";
import Image from "next/image";
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
  const [localPreviewUrls, setLocalPreviewUrls] = useState<ImageMeta[]>([]);
  const [dragging, setDragging] = useState(false);

  const processFiles = async (files: FileList) => {
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    console.log("processing file");
    const newPreviewUrls = new Array<ImageMeta>();

    newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    for (const file of files) {
      try {
        const EXIFData = await exifr.parse(file, [
          "DateTimeOriginal",
          "GPSLatitude",
          "GPSLongitude",
        ]);

        if (EXIFData) {
          const {
            DateTimeOriginal,
            GPSLatitude,
            GPSLongitude,
            latitude,
            longitude,
          } = EXIFData;
          console.log(`Extracted EXIF Data`);
          console.log(latitude, longitude);
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
          newPreviewUrls.push({
            url: URL.createObjectURL(file),
            name: file.name,
            DateTaken: null,
            location: null,
            progress: 0,
            status: "idle",
          });
        }
      } catch (error) {
        console.error("Error parsing EXIF:", error);
      }
    }

    setLocalPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
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

        console.log(`Sending chunk ${chunk} of ${totalChunks} for ${file.name}`);
        const response = await fetch("/api/image-upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Chunk upload failed: ${errorData.message || response.statusText}`);
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
    <div className="w-full  sm:mx-auto  p-4  relative mx-0 max-w-full ">
      <input
        className="hidden"
        type="file"
        ref={inputRef}
        multiple
        onChange={handleFileSelect}
      />

 

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

        <div className="grid grid-flow-row sm:grid-cols-3 gap-4 mt-4 items-start justify-start     ">
          {localPreviewUrls.map(
            ({ name, url, DateTaken, location, progress, status }, index) => (
              <div
                key={index}
                className="  relative min-w-full   aspect-video flex flex-col   "
              >
                <img
                  src={url}
                  alt={name}
                  className="object-cover w-full aspect-video"
                />

                {/* <ImagePreviewCard
                  status={status}
                  name={name}
                  url={url}
                  DateTaken={DateTaken}
                  location={location}
                  onDelete={() => handleRemoveFile(index)}
                  onDelete={() => handleRemoveFile(index)}
                  progress={progress}
                /> */}
              </div>
            )
          )}
        </div>
      </section>
      <section className="fixed bottom-0 left-0 w-full px-4 py-2 flex justify-center  items-center bg-black ">
        <Button

          onClick={()=>{
            uploadImages()
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
