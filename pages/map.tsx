import MapComponent from "@/components/map";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import {
  Calendar1Icon,
  CalendarIcon,
  FastForward,
  ForwardIcon,
  MapIcon,
  RadarIcon,
  Rewind,
  RewindIcon,
} from "lucide-react";
import { Noto_Sans_Georgian } from "next/font/google";
import { useState } from "react";
const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});
const DatePickerCustom = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"default"}
          className={cn(
            "w-[280px] justify-start text-left font-normal ",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto " align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const TimePickerCustom = () => {
  const [hours, setHours] = useState<number>(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="flex items-center gap-2 text-black">
      <Button
        title="-10წუთი"
        className="text-white"
        variant={"ghost"}
        size={"icon"}
      >
        <Rewind size={16} />
      </Button>
      <div className="flex">
        <input
          min={0}
          max={23}
          maxLength={2}
          placeholder="HH"
          type="number"
          className={
            "w-12 h-10 pl-2  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-sm"
          }
        />
        <span className="h-full flex items-center px-2 text-white ">:</span>
        <input
          placeholder="MM"
          min={0}
          max={59}
          type="number"
          className={
            " h-10 pl-2 w-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-md"
          }
        />
      </div>
      <Button
        title="+10 წუთი"
        className="text-white"
        variant={"ghost"}
        size={"icon"}
      >
        <FastForward size={16} />
      </Button>
    </div>
  );
};

const DistanceSelector = () => {
  const [range, setRange] = useState(0);
  return (
    <input
      max={300}
      min={0}
      id="default-range"
      type="range"
      value={range}
      onChange={(e) => setRange(parseInt(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
  );
};

export default function Map() {
  return (
    <div className={`w-full h-full ${notoGeorgian.className} flex flex-col `}>
      <section className="w-full min-h-20 items-center flex border-b border-b-gray-500  px-4   gap-6 h-20">
        <div className="py-2 uppercase font-semibold text-lg space-y-1 text-gray-300">
          <DatePickerCustom />
        </div>
        <div className="py-2 uppercase font-semibold text-lg space-y-2 text-gray-300  flex items-center flex-col ">
          <div className="flex gap-1">
            <TimePickerCustom />
            {/* <TimePickerCustom /> */}
          </div>
        </div>
        <div>
          <Button>მოძებნე</Button>
        </div>
      </section>
      <section className="w-full h-full mx-auto border -600 flex ">
        <section className="w-[calc(100%-750px)] h-full  flex-shrink relative bg-yellow-300">
          <MapComponent
            defaultLocation={null}
            isInteractive={true}
            onNewCoordinates={() => {}}
          />
        </section>
        <section className="w-[750px] h-full bg-gray-100 text-black border-l-2 border-l-gray-400 flex-shrink-0 flex items-center justify-center">
          <article className="  min-w-28 mx-12 p-4 flex items-start flex-col">
            <h3 className="font-semibold text-gray-800 text  ">
              როგორ მოვძებნოთ სასურველი ფოტოები
            </h3>
            <div className="flex flex-col mt-3 gap-4 text-base">
              <div className=" w-full flex items-center gap-3 ">
                <span className="text-gray-500 ">
                  <MapIcon size={18} />
                </span>
                <div>რუკაზე დაკლიკებით აირჩიეთ სასურველი ზუსტი ლოკაცია</div>
              </div>
              <div className=" w-full text-gray-800 inline-flex items-start gap-2 ">
                <span className="text-gray-500 translate-y-1 ">
                  <Calendar1Icon size={18} />
                </span>
                <div>
                  აირჩიეთ თარიღი და დროის დიაპაზონი (რომელი საათიდან რომელ
                  საათმდე)
                </div>
              </div>
              <div className=" w-full flex gap-3 items-center ">
                <span className="text-gray-500 ">
                  <RadarIcon size={18} />
                </span>
                <div>
                  დაარეგულირეთ რადიუსი. რესურსების დაზოგვის მიზნით ფოტოების
                  მოძებნა შესაძლებელია მაქსიმუმ 300 მეტრიან რადიუსში
                </div>
              </div>
            </div>
          </article>
        </section>
      </section>
    </div>
  );
}
