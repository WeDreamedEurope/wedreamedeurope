import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDateTimeContext } from "@/context/DateTimeContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ka } from "date-fns/locale";
import { Calendar1, FastForward, PlusIcon, Rewind } from "lucide-react";
import { useState } from "react";
import { FormHeaderProps } from ".";
import { ClipLoader, BeatLoader, BarLoader, HashLoader } from "react-spinners";
import { usePhotoLoader } from "@/context/PhotoLoaderContext";
import { useMapContext } from "@/context/MapContenxt";

export default function FormHeaderMob({
  readyForLoad,
  doSearch,
}: FormHeaderProps) {
  const {
    selectedDate,
    setCurrentDate,
    isValidTime,
    changeTime,
    hour,
    setHour,
    setMinute,
    minute,
  } = useDateTimeContext();

  const { stateOfAction } = usePhotoLoader();
  const { selectedLocation } = useMapContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const btnLabel = () => {
    if (isValidTime && selectedDate !== undefined) {
      return (
        <>
          {/* {format(selectedDate, "d MMMM, HH:mm")} */}
          <Calendar1 /> {format(selectedDate, "d MMMM, HH:mm", { locale: ka })}
        </>
      );
    } else {
      return (
        <>
          <PlusIcon /> მონიშნე თარიღი და დრო
        </>
      );
    }
  };

  return (
    <div className="flex sm:hidden w-full h-20 items-center justify-evenly px-4 ">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={!selectedLocation}
            variant={"outline"}
            className={cn(
              " flex-shrink-0 z-40 text-yellow-950 font-semibold border-2 ",
              {
                "bg-yellow-200 animate-pulse text-yellow-950 border-yellow-950":
                  !isValidTime || !selectedDate,
                "bg-green-200 animate-none border border-green-900   text-green-950":
                  isValidTime && selectedDate,
              }
            )}
          >
            {btnLabel()}
          </Button>
        </DialogTrigger>
        <DialogContent className=" border-none bg-black max-w-[400px] rounded-md ">
          <DialogHeader>
            <DialogTitle className="text-left">I Am Dialog Header</DialogTitle>
          </DialogHeader>
          <DialogDescription hidden={true}>
            დაამატე დიალოგის რაღაცეები
          </DialogDescription>
          <div className=" ">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setCurrentDate}
            />
          </div>
          <section className="bg-gray-950 flex items-center p-4 justify-center">
            <div
              className={cn(
                "flex items-center gap-2 text-black p-2 rounded-lg focus:outline-yellow-800 transition-colors bg-yellow-950",
                {
                  "bg-green-950": isValidTime,
                  "opacity-35": !selectedDate,
                  "pointer-events-none": !selectedDate,
                }
              )}
            >
              <Button
                disabled={!isValidTime}
                title="-10წუთი"
                className="text-white"
                variant={"ghost"}
                size={"icon"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  changeTime(false);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  changeTime(false);
                }}
              >
                <Rewind size={16} />
              </Button>
              <div className="flex">
                <input
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="HH"
                  className={cn(
                    "w-12 h-10 bg-yellow-700  text-center  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-sm",
                    hour !== "" && "bg-green-800 text-green-300"
                  )}
                  maxLength={2}
                />
                <span>:</span>
                <input
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="MM"
                  className={cn(
                    "w-12 h-10 bg-yellow-700  text-center  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-sm",
                    minute !== "" && "bg-green-800 text-green-300"
                  )}
                  maxLength={2}
                />
              </div>
              <Button
                // disabled={!isValidTime}
                title="+10წუთი"
                className="text-white disabled:opacity-40"
                variant={"ghost"}
                size={"icon"}
                onTouchStart={(e) => {
                  e.preventDefault();
                  changeTime(true);
                }}
              >
                <FastForward size={16} />
              </Button>
            </div>
          </section>
          <DialogFooter>
            <Button
              disabled={!readyForLoad}
              onClick={() => {
                setIsDialogOpen(false);

                doSearch();
              }}
              size={"lg"}
            >
              მოძებნე
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative overflow-hidden">
        {stateOfAction === "loading" && (
          <div className="absolute top-0 left-0 w-full h-full  bg-gray-200/60 z-20 flex items-center justify-center overflow-hidden rounded-md">
            <ClipLoader size={18} speedMultiplier={0.5} color="black" />
          </div>
        )}
        <Button
          disabled={!readyForLoad || stateOfAction === "loading"}
          variant={"secondary"}
        >
          მოძებნე
        </Button>
      </div>
    </div>
  );
}
