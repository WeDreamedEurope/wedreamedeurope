import { Upload } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import React from "react";

export default function UploadForm({
  onFileDropped,
  processFiles,
}: {
  processFiles: (files: FileList) => void;
  onFileDropped: (files: FileList) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent) => {
    const filez = (event.target as HTMLInputElement).files;
    if (!filez) return;
    processFiles(filez);
  };

  const handleDragEnter = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(false);
  };

  const handleDragDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setIsDragging(false);

    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      onFileDropped(files);
    }
  };

  return (
    <div
      className={`border-2 border-dashed mt-12 focus:border-transparent active  :border-red-300  rounded-lg p-8 text-center mb-6  transition-colors duration-300 sticky top-0 border-[#2b3123] z-40
      ${
        isDragging
          ? "border-[#b9c2af] bg-[blue-500] bg-opacity-10"
          : "border-gray-600 hover:border-gray-500"
      } 
      
      transition-all duration-200`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragDrop}
    >
      <>
        <Upload className="h-16 w-16 mx-auto mb-4 text-[#e8e9e2]" />
        <input
          ref={fileInputRef}
          type="file"
          id="file-input"
          className="hidden"
          multiple
          accept=".jpg,.jpeg,.heic"
          onChange={handleFileSelect}
        />
        <label
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="cursor-pointer"
        >
          <span className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded inline-block mb-4">
            აირჩიეთ ფაილი
          </span>
        </label>
        <p className="text-gray-400">ან ჩააგდეთ ფაილი აქ</p>
        <p className="text-xs mt-2 text-gray-300">JPEG, JPG, HEIF</p>
      </>
    </div>
  );
}
