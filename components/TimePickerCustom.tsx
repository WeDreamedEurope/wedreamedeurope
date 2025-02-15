import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FastForward, Rewind } from "lucide-react";
import { useDateTimeContext } from "@/context/DateTimeContext";

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

  return (
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
        onClick={() => changeTime(false)}
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
        disabled={!isValidTime}
        title="+10წუთი"
        className="text-white"
        variant={"ghost"}
        size={"icon"}
        onClick={() => changeTime(true)}
      >
        <FastForward size={16} />
      </Button>
    </div>
  );
};
