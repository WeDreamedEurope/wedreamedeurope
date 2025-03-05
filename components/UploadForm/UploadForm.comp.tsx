import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import React from "react";

export default function UploadForm({
  onFileDropped,
}: {
  onFileDropped: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileDropped(files[0]);
    }
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
      onFileDropped(files[0]);
    }
  };

  return (
    <div
      className={`sm:border-2 sm:border-dashed  rounded-lg p-8 text-center mb-6  transition-colors duration-300 sticky top-0 bg-[#181c14] z-40
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
        <input
          ref={fileInputRef}
          type="file"
          id="file-input"
          className="hidden"
          onChange={handleFileSelect}
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <span className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded inline-block mb-4">
            აირჩიეთ ფაილი
          </span>
        </label>
        <p className="text-gray-400">
          ან ჩააგდეთ ფაილი აქ {isDragging ? "Yes" : "NO"}
        </p>
      </>
    </div>
  );
}
