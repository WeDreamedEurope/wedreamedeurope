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

export default function FormHeaderMob() {
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
    <div className="flex sm:hidden w-full h-20 items-center justify-center px-4 ">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(" z-40", {
              "border-yellow-400 animate-pulse": !isValidTime || !selectedDate,
              "border-green-400 animate-none bg-green-900":
                isValidTime && selectedDate,
            })}
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
                // onClick={(e) => {
                //   e.preventDefault();
                //   e.stopPropagation();
                //   changeTime(true);
                //   console.log(`Change Of Time`)
                // }}
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
              onClick={() => {
                setIsDialogOpen(false);
              }}
              size={"lg"}
            >
              მოძებნე
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
