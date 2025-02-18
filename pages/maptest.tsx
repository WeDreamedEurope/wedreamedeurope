import MapComponent from "@/components/map";

import FormHeader from "@/components/form/FormHeader";
import { Button } from "@/components/ui/button";
import { DateTimeProvider } from "@/context/DateTimeContext";
import { generateRandomData } from "@/lib/dummygisdata";
import { Photo_Location_Select } from "@/server/gis_query";
import { Noto_Sans_Georgian } from "next/font/google";
import { useState } from "react";
const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});
const MapTest = () => {
  const [pointsToDisplay, setPointsToDisplay] = useState<[number, number][]>(
    []
  );
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
              points={pointsToDisplay}
              defaultLocation={
                [44.76129881033887, 41.718473154007896] as [number, number]
              }
              isInteractive={true}
              onNewCoordinates={() => {}}
            />
          </section>
          {/* Map Sidebar */}
        </section>
      </div>
    </DateTimeProvider>
  );
};

export default MapTest;
