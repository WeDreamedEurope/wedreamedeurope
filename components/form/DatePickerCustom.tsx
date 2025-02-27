import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useDateTimeContext } from "@/context/DateTimeContext";
import { useState } from "react";

export const DatePickerCustom = () => {
  const { selectedDate, setCurrentDate } = useDateTimeContext();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"default"}
          className={cn(
            "sm:w-[280px] justify-start text-left  bg-yellow-200 hover:bg-yellow-300 text-yellow-950 font-semibold border border-yellow-900",
            {
              "bg-green-200 text-green-950 border-green-900 hover:bg-green-300": selectedDate,
            }
          )}
        >
          <CalendarIcon />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>აირჩიე თარიღი</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto" align="start">
        <Calendar
          classNames={{}}
          mode="single"
          selected={selectedDate}
          onSelect={(selected) => {
            setCurrentDate(selected);
            setTimeout(() => {
              setOpen(false);
            }, 500);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
