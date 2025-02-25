import FormHeader from "@/components/form/FormHeader";
import MapComponent from "@/components/map";
import { DateTimeProvider } from "@/context/DateTimeContext";
import { generateRandomData } from "@/lib/dummygisdata";
import { Photo_Location_Select } from "@/server/gis_query";
import { Noto_Sans_Georgian } from "next/font/google";
import { useEffect, useState } from "react";
import testImage from "@/public/someimage.jpg";
import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});
const MapTest = () => {
  const [pointsToDisplay, setPointsToDisplay] = useState<[number, number][]>(
    []
  );

  const [loadedImages, setLoadedImages] = useState<StaticImageData[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTestImages();
      console.log(`Now We Are Setting The Images`);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
      radius: JSON.stringify(300),
    });
    const response = await fetch(`/api/map?${params.toString()}`, {
      method: "get",
    });
    const data = (await response.json()) as Photo_Location_Select[];
    setPointsToDisplay(data.map(({ locationTakenAt }) => locationTakenAt));
  };

  const loadTestImages = () => {
    const n = 15; // specify the number of items
    const emptyArray = Array(n)
      .fill("")
      .map((_, i) => testImage);

    setPointsToDisplay(
      generateRandomData(n).map(({ locationTakenAt }) => locationTakenAt)
    );
    setLoadedImages(emptyArray);
  };

  return (
    <DateTimeProvider>
      <div
        className={`w-full h-full ${notoGeorgian.className} flex flex-col overflow-hidden `}
      >
        <FormHeader />
        {/* <section className="w-full p-4 bg-purple-500 flex gap-4">
          <Button onClick={() => insertDummyData()}>Insert Data</Button>
          <Button variant={"secondary"} onClick={() => LoadConfigData()}>
            Load Points
          </Button>
        </section> */}
        <section className="w-full h-full mx-auto  flex ">
          <section className="w-full sm:w-[calc(100%-750px)] lg:w-[40%] h-full   relative bg-yellow-300 flex-shrink-0">
            <MapComponent
              points={pointsToDisplay}
              defaultLocation={
                [44.76129881033887, 41.718473154007896] as [number, number]
              }
              isInteractive={true}
              onNewCoordinates={() => {}}
            />
          </section>
          {/* Map Sidebar */}
          <aside className="w-full grid grid-cols-2 bg-black p-4 lg:w-[60%] place-content-start gap-2 overflow-auto pb-32">
            {loadedImages.map((i, index) => (
              <div
                key={index}
                className="w-full aspect-video flex flex-col relative border border-gray-600 "
              >
                <div className="relative  w-full aspect-video">
                  <Image src={testImage} fill alt="" className="object-cover" />
                </div>
                <div className="text-gray-300 font-semibold text-sm px-2 py-2  flex items-center justify-between ">
                  <div>27.12.1986</div>
                  <div>~ 4 მეტრში</div>
                  <div>
                    <Button size={"sm"}>რუკაზე ნახვა</Button>
                  </div>
                </div>
              </div>
            ))}
          </aside>
        </section>
      </div>
    </DateTimeProvider>
  );
};

export default MapTest;
