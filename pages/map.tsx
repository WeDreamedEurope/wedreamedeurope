import { DatePickerCustom } from "@/components/DatePickerCustom";
import MapComponent from "@/components/map";
import { TimePickerCustom } from "@/components/TimePickerCustom";
import { Button } from "@/components/ui/button";
import { DateTimeProvider } from "@/context/DateTimeContext";
import { Calendar1Icon, MapIcon, RadarIcon } from "lucide-react";
import { Noto_Sans_Georgian } from "next/font/google";

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

const Map = () => {
  return (
    <DateTimeProvider>
      <div className={`w-full h-full ${notoGeorgian.className} flex flex-col `}>
        <section className="w-full min-h-20 items-center flex border-b border-b-gray-500  px-4   gap-6 h-20">
          <div className="py-2 uppercase font-semibold text-lg space-y-1 text-gray-300">
            <DatePickerCustom />
          </div>
          <div className="py-2 uppercase font-semibold text-lg space-y-2 text-gray-300  flex items-center flex-col ">
            <div className="flex gap-1">
              <TimePickerCustom />
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
    </DateTimeProvider>
  );
};

export default Map;
