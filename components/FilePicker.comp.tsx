import { ChangeEvent, useRef, useState, DragEvent } from "react";
import { Upload } from "lucide-react";
import { ImagePreviewCard } from "./PreviewCard.comp";
export default function ImagePicker() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [localPreviewUrls, setLocalPreviewUrls] = useState<
    { url: string; name: string }[]
  >([]);
  const [dragging, setDragging] = useState(false);

  const processFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    const newPreviewUrls = newFiles.map<{ url: string; name: string }>(
      (file) => ({ url: URL.createObjectURL(file), name: file.name })
    );
    setLocalPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };



  const extractEXIF = async (file: File) => {
      if(file.type !== "image/") return null;

      return new Promise((resolve, reject) => {

        const reader = new FileReader();
        reader.onload = async (event) => {

            const view  = new DataView(event.target?.result as ArrayBuffer);
        }

      })
       
  }

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

  return (
    <div className="w-full max-w-2xl mx-auto border border-blue-300 p-4">
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

        <div className="grid grid-cols-3 gap-4 mt-4">
          {localPreviewUrls.map(({ name, url }, index) => (
            <ImagePreviewCard
              key={index}
              name={name}
              url={url}
              onDelete={() => {}}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
