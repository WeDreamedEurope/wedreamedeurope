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
  MapIcon,
  RadarIcon,
  Rewind,
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
    <Popover>
      <PopoverTrigger asChild>
        <Button>დროის არჩევა</Button>
      </PopoverTrigger>
      <PopoverContent
        className={`w-auto  bg-gray-900 text-white ${notoGeorgian.className} rounded-lg`}
        align="center"
      >
        <div className="w-auto flex-flex-col px-4 max-w-sm flex flex-col gap-3 bg-gray-700 p-3 ">
          <div className="flex  items-center">
            <div className="flex gap-2 items-center">
              <div className="flex flex-col gap-1 text-xs text-center">
                <div>საათი</div>
                <input
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  placeholder="00"
                  type="number"
                  min={1}
                  max={23}
                  className="border flex h-10 rounded-md  focus:text-black bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <span className=" h-10 flex items-center translate-y-2 text-2xl">
                :
              </span>
              <div className="flex flex-col gap-1 text-xs text-center">
                <div>წუთი</div>
                <input
                  placeholder="00"
                  type="tel"
                  min={0}
                  max={59}
                  className="border flex h-10 rounded-md  focus:text-black bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>
          
        </div>
      </PopoverContent>
    </Popover>
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
      <header className="w-full h-20 bg-blue-900 flex items-center justify-between px-4">
        Our Struggle
      </header>
      <section className="w-full min-h-14 items-center border-b border-b-gray-500 flex px-4 h-auto">
        <div className="py-2 uppercase font-semibold text-lg space-y-2 text-gray-300">
          <div>თარიღი</div>
          <DatePickerCustom />
        </div>
        <div className="py-2 uppercase font-semibold text-lg space-y-2 text-gray-300">
          <div>დროის დიაპაზონი</div>
          <div className="flex gap-1">
            <TimePickerCustom />
            {/* <TimePickerCustom /> */}
          </div>
        </div>
        <div className="py-2 uppercase font-semibold text-lg space-y-2 text-gray-300">
          <div>რადიუსი</div>
          <div className="flex h-10   items-center gap-1">
            <DistanceSelector />
          </div>
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
