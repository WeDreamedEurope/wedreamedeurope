import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

function PhotoCard({
  photo,
  onDeleteClick,
}: {
  photo: {
    id: string;
    url: string;
    date: Date;
    title: string;
  };
  onDeleteClick: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-md">
      <Image
        src={photo.url || "/placeholder.svg"}
        alt={photo.title}
        width={300}
        height={300}
        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-start justify-end p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onDeleteClick}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="text-sm font-medium">{photo.title}</p>
        <p className="text-xs opacity-80">
          {format(photo.date, "MMM d, yyyy")}
        </p>
      </div>
    </div>
  );
}
