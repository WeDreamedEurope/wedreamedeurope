import { ChangeEvent, useRef, useState, DragEvent } from "react";
import { Upload } from "lucide-react";
import { ImagePreviewCard } from "./PreviewCard.comp";
import exifr from "exifr";

type ImageMeta = {
  url: string;
  name: string;
  DateTaken: Date | null;
  location: [number, number] | null;
  
};
export default function ImagePicker() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [localPreviewUrls, setLocalPreviewUrls] = useState<ImageMeta[]>([]);
  const [dragging, setDragging] = useState(false);

  const processFiles = async (files: FileList) => {
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    console.log("processing file")
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
          const { DateTimeOriginal, GPSLatitude, GPSLongitude,latitude, longitude } = EXIFData;
          console.log(`Extracted EXIF Data`)
          console.log(latitude, longitude)
          newPreviewUrls.push({
            url: URL.createObjectURL(file),
            name: file.name,
            DateTaken: DateTimeOriginal || null,
            location:
              GPSLatitude && GPSLongitude ? [longitude, latitude] : null,
          });
        } else {
          newPreviewUrls.push({
            url: URL.createObjectURL(file),
            name: file.name,
            DateTaken: null,
            location: null,
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

  return (
    <div className="w-full max-w-2xl mx-auto  p-4">
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
            w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center curpser-pointer transition-colors`}
      >
        <Upload size={48} />
        <p className="text-gray-500 text-sm">Click to select a file</p>
      </div>

      <section>
        <h3 className="text-2xl font-semibold capitalize">Selected Photos</h3>

        <div className="grid grid-cols-2 gap-4 mt-4 items-start justify-start ">
          {localPreviewUrls.map(({ name, url, DateTaken, location }, index) => (
            <div key={index} className=" w-full aspect-video ">
              <ImagePreviewCard
                name={name}
                url={url}
                DateTaken={DateTaken}
                location={location}
                onDelete={() => handleRemoveFile(index)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
