import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClockIcon, FastForward, Rewind } from "lucide-react";
import { useDateTimeContext } from "@/context/DateTimeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export const TimePickerCustom = () => {
  const {
    hour: hours,
    minute: minutes,
    setHour: setHours,
    setMinute: setMinutes,
    isValidTime,
    selectedDate,
    changeTime,
  } = useDateTimeContext();

  const [open, setIsOpen] = useState(false);

  const getLabel = () => (hours && minutes ? `${hours}:${minutes}` : "საათი");

  const mainContent = () => {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-black p-2 rounded-lg focus:outline-yellow-800 transition-colors bg-yellow-950",
          {
            "bg-green-950": isValidTime,
            // "opacity-35": !selectedDate,
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
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="HH"
            className={cn(
              "w-12 h-10 bg-yellow-700  text-center  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-sm",
              hours !== "" && "bg-green-800 text-green-300"
            )}
            maxLength={2}
          />
          <span>:</span>
          <input
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="MM"
            className={cn(
              "w-12 h-10 bg-yellow-700  text-center  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-sm",
              minutes !== "" && "bg-green-800 text-green-300"
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            changeTime(true);
          }}
          onTouchStart={(e) => {
            alert(`YO?!`);
            e.preventDefault();
            changeTime(true);
          }}
        >
          <FastForward size={16} />
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="hidden sm:block">{mainContent()}</div>
      <div className="block sm:hidden">
        <Popover open={open} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              className={cn({
                "bg-yellow-700": hours.length === 0 || minutes.length == 0,
              })}
              variant={"default"}
              size={"lg"}
            >
              <ClockIcon />
              {getLabel()}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            // onClick={(e) => setIsOpen(false)}
            className="w-full h-[400px]  border-none bg-yellow-900 shadow-none"
            align="center"
          >
            {mainContent()}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
