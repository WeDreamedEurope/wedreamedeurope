import Image from "next/image";
import { Input } from "postcss";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ka } from "date-fns/locale";
type Props = {
  url: string;
  name: string;
  onDelete: () => void;
};
export function ImagePreviewCard({ url, onDelete, name }: Props) {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="flex flex-col">
      <Image
        src={url}
        width={300}
        height={200}
        className="w-full object-cover"
        alt=""
      />
      <footer className="mt-2 flex justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`  w-auto justify-start text-left font-normal text-s 
            ${date ? "text-blue-500" : "text-gray-500"}`}
            >
              <CalendarIcon className="mr-1 h-4 w-4" />
              {date ? (
                format(date, "dPP", { locale: ka })
              ) : (
                <span>აირჩიე თარიღი</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date!}
              onSelect={(e) => {
                setDate(e!);
              }} // onSelect
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </footer>
    </div>
  );
}
