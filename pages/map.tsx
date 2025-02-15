import { DatePickerCustom } from "@/components/DatePickerCustom";
import MapComponent from "@/components/map";
import { TimePickerCustom } from "@/components/TimePickerCustom";
import { Button } from "@/components/ui/button";
import { DateTimeProvider } from "@/context/DateTimeContext";
import { Calendar1Icon, MapIcon, RadarIcon, X } from "lucide-react";
import { Noto_Sans_Georgian } from "next/font/google";
import styles from "@/styles/map.module.css";
import { useState } from "react";
const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

const Map = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <DateTimeProvider>
      <div className={`w-full h-full ${notoGeorgian.className} flex flex-col `}>
        <section className="w-full min-h-20 items-center flex   px-4   sm:gap-6 h-20  border border-red-700 ">
          <div className="  flex-shrink-0">
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
        <section className="w-full h-full mx-auto  flex ">
          <section className="w-full sm:w-[calc(100%-750px)] h-full  flex-shrink relative bg-yellow-300">
            <MapComponent
              defaultLocation={null}
              isInteractive={true}
              onNewCoordinates={() => {}}
            />
          </section>
          {/* Map Sidebar */}
          {showSidebar && (
            <aside className={`${styles.mapSidebar}`}>
              <article className=" flex-grow bg-blue-600   min-w-28 mx-12 p-4 flex items-start justify-center flex-col">
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
              <div className="   bg-purple-500 w-full min-h-20 flex items-center justify-center">
                <Button
                  onClick={() => setShowSidebar(false)}
                  className=""
                  size={"sm"}
                >
                  <MapIcon />
                  Show Map
                </Button>
              </div>
            </aside>
          )}
        </section>
      </div>
    </DateTimeProvider>
  );
};

export default Map;
