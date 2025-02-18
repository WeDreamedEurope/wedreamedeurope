import MapComponent from "@/components/map";

import FormHeader from "@/components/form/FormHeader";
import { Button } from "@/components/ui/button";
import { DateTimeProvider } from "@/context/DateTimeContext";
import styles from "@/styles/map.module.css";
import { Calendar1Icon, MapIcon, RadarIcon } from "lucide-react";
import { Noto_Sans_Georgian } from "next/font/google";
import { CSSProperties, useState } from "react";
import { generateRandomData } from "@/lib/dummygisdata";
import { Photo_Location_Insert } from "@/server/gis_query";
const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});
type AnimationState = "running" | "paused";
const MapTest = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [animationState, setAnimationState] =
    useState<AnimationState>("paused");

  const insertDummyData = async () => {
    const dummyData = generateRandomData();
    const response = await fetch("/api/map", {
      method: "post",
      body: JSON.stringify(dummyData),
    });
    const data = await response.json();

    console.log(data);
  };

  const LoadConfigData = async () => {
    const params = new URLSearchParams({
      center: JSON.stringify([44.76129881033887, 41.718473154007896]),
      radius: JSON.stringify(500),
    });
    const response = await fetch(`/api/map?${params.toString()}`, {
      method: "get",
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <DateTimeProvider>
      <div className={`w-full h-full ${notoGeorgian.className} flex flex-col `}>
        <FormHeader />
        <section className="w-full p-4 bg-purple-500 flex gap-4">
          <Button onClick={() => insertDummyData()}>Insert Data</Button>
          <Button variant={"secondary"} onClick={() => LoadConfigData()}>
            Load Points
          </Button>
        </section>
        <section className="w-full h-full mx-auto  flex ">
          <section className="w-full sm:w-[calc(100%-750px)] h-full  flex-shrink relative bg-yellow-300">
            <MapComponent
              defaultLocation={
                [44.76129881033887, 41.718473154007896] as [number, number]
              }
              isInteractive={true}
              onNewCoordinates={() => {}}
            />
          </section>
          {/* Map Sidebar */}
          {showSidebar && (
            <aside className={`${styles.mapSidebar}`}>
              <section className="h-[200px] w-full  p-4 py-6  flex items-center justify-center ">
                <div
                  onClick={() => setAnimationState("paused")}
                  style={
                    {
                      "--animation-play-state": animationState,
                    } as CSSProperties & {
                      "--animation-play-state": AnimationState;
                    }
                  }
                  className={`h-full w-full bg-black p-4 ${styles["map-footer"]}`}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
                  ad omnis esse id sunt sint necessitatibus eveniet impedit
                  natus tenetur.
                </div>
              </section>
              <article className=" flex-grow    min-w-28  p-6 flex items-start justify-center flex-col">
                <h3 className="font-semibold text-gray-300 text  ">
                  როგორ მოვძებნოთ სასურველი ფოტოები
                </h3>
                <div className="flex flex-col mt-3 gap-4 text-base">
                  <div className=" w-full flex items-center gap-3 ">
                    <span className="text-blue-500 ">
                      <MapIcon size={18} />
                    </span>
                    <div>რუკაზე დაკლიკებით აირჩიეთ სასურველი ზუსტი ლოკაცია</div>
                  </div>
                  <div className=" w-full text-gray-300 inline-flex items-start gap-2 ">
                    <span className="text-blue-500 translate-y-1 ">
                      <Calendar1Icon size={18} />
                    </span>
                    <div>
                      აირჩიეთ თარიღი და დროის დიაპაზონი (რომელი საათიდან რომელ
                      საათმდე)
                    </div>
                  </div>
                  <div className=" w-full flex gap-3 items-center ">
                    <span className="text-blue-500 ">
                      <RadarIcon size={18} />
                    </span>
                    <div>
                      დაარეგულირეთ რადიუსი. რესურსების დაზოგვის მიზნით ფოტოების
                      მოძებნა შესაძლებელია მაქსიმუმ 300 მეტრიან რადიუსში
                    </div>
                  </div>
                </div>
              </article>
              <div
                className={`bg-gray-900 w-full min-h-20 flex items-center justify-center `}
              >
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

export default MapTest;
