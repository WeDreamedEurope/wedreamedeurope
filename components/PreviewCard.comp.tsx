import Image from "next/image";
import { Input } from "postcss";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { CalendarIcon, MapPin, Clock } from "lucide-react";
import { format, setHours, setMinutes } from "date-fns";
import { ka } from "date-fns/locale";
type Props = {
  url: string;
  name: string;
  DateTaken: Date | null;
  onDelete: () => void;
  location?: [number, number] | null;
};
export function ImagePreviewCard({
  url,
  onDelete,
  name,
  DateTaken,
  location,
}: Props) {
  const [date, setDate] = useState<Date | null>(DateTaken);

  return (
    <div className="flex flex-col w-full aspect-video">
      <div className="relative w-full aspect-video">
        <Image
          src={url}
          fill
          className="w-full object-cover"
          alt=""
          onClick={(e) => {
            if (e.ctrlKey) {
              onDelete();
            }
          }}
        />
        <figcaption className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          {date ? format(date, "dd-MM-HH-mm-yyyy", { locale: ka }) : name}
        </figcaption>
      </div>
      <footer className="mt-2 flex justify-between items-center">
        <Popover onOpenChange={(e) => console.log(e)}>
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
              disabled={DateTaken ? true : false}
              mode="single"
              selected={date!}
              onSelect={(e) => {
                console.log(e);

                setDate(e!);
              }} // onSelect
              initialFocus
            />
            <div className="h-12 flex items-center px-4 ">
              <div className="flex items-center">
                {/* <Clock size={16} className="mr-2" /> */}
                <div className="space-x-2">
                  <input
                    placeholder="HH"
                    className="border w-auto border-black p-1"
                    type="number"
                    min={0}
                    max={23}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        console.log(
                          `%cWe Have Prevented Something!`,
                          "color:yellow"
                        );
                        return;
                      }
                      console.log(`Hour`, e.target.value);
                      setDate((prev) => {
                        if (!prev) return prev;
                        return setHours(prev, parseInt(e.target.value));
                      });
                    }}
                  />
                  <input
                    placeholder="MM"
                    className="border w-auto border-black p-1"
                    type="number"
                    min={0}
                    max={59}
                    onChange={(e) => {
                      console.log(`This Is Minutes Thing`);
                      console.log(e.target.value);
                      setDate((prev) => {
                        if (!prev) return prev;
                        return setMinutes(prev, parseInt(e.target.value));
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <button
          className={`flex items-center justify-center bg-green-600 w-10 h-10 rounded-md ${
            location ? "opacity-40" : "opacity-100"
          }`}
        >
          <MapPin size={24} className={` text-green-300   `} />
        </button>
      </footer>
    </div>
  );
}
