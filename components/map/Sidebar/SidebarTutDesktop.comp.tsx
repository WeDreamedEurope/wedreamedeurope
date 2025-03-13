import { Button } from "@/components/ui/button";
import { useDateTimeContext } from "@/context/DateTimeContext";
import { useMapContext } from "@/context/MapContenxt";
import {
  calculateDistanceInMeters,
  generateRandomData,
} from "@/lib/dummygisdata";
import { Photo_Location_Client } from "@/API_CALLS/gis_query";
import { CollectPhotoMetaData } from "@/API_CALLS/user/user.server";
import { getDate, getHours, getMinutes, getMonth } from "date-fns";
import { motion } from "framer-motion";
import { CalendarIcon, Clock, ImagePlayIcon, MapIcon } from "lucide-react";
import { useState } from "react";
import SidebarTutorialMob from "./SidebarTuTMob.comp";
// 41.718467362626356, 44.761303115927696
const DebugActions = () => {
  const [loading, setLoading] = useState(false);

  const generateData = async () => {
    const data = generateRandomData(
      30,
      19,
      0,
      21,
      0,
      44.762327177662875,
      41.71848662012972,
      0.1
    );
    setLoading(true);
    const insrtedData = await CollectPhotoMetaData(data);
    console.log(insrtedData);
    setLoading(false);
  };

  const loadData = async () => {
    const response = await fetch("/api/photolibrary/getall");
    const photos = await response.json();
    console.log(
      (photos as Photo_Location_Client[]).map((i) => ({
        month: getMonth(i.dateTakenAt!),
        day: getDate(i.dateTakenAt!),
        hours: getHours(i.dateTakenAt!),
        minutes: getMinutes(i.dateTakenAt!),
        distance: calculateDistanceInMeters(
          i.locationTakenAt,
          [44.761303115927696, 41.718467362626356]
        ),
      }))
    );
  };

  return (
    <div className="flex gap-2">
      <Button disabled={loading} onClick={generateData}>
        {loading ? "Generating..." : "Generate Data"}
      </Button>
      <Button disabled={loading} onClick={loadData}>
        {loading ? "Loading..." : "Load Data"}
      </Button>
    </div>
  );
};

function SidebarTutorialDesktop() {
  const { selectedLocation } = useMapContext();
  const { isValidTime } = useDateTimeContext();
  return (
    <motion.div className="w-full h-full hidden   flex-grow  flex-col  sm:flex items-center justify-center text-gray-200 ">
      <div className="bg-red-[#31363F] p-6">
        <h1 className="font-semibold mb-4 text-xl">როგორ ვიპოვნოთ ფოტოები</h1>

        <article className="flex flex-col gap-4 text-sm transition-colors ">
          <div
            className={`flex items-center gap-2 bg-gray-700 p-4 rounded-lg text-base ${
              selectedLocation ? "text-green-200" : "text-yellow-200"
            } `}
          >
            <MapIcon size={24} />
            რუკაზე ორჯერ დაკლიკებით მონიშნეთ სასურველი ლოკაცია
          </div>
          <div
            className={`flex items-center gap-2 bg-gray-700 p-4 rounded-lg text-base ${
              isValidTime ? "text-green-200" : "text-yellow-200"
            } `}
          >
            <CalendarIcon size={18} />
            აირჩიეთ თვის სასურველი რიცხვი და დრო
          </div>
        </article>
        <DebugActions />
        <div className="flex flex-col gap-4 mt-6 text-xs bg-gray-800   opacity-60 rounded-lg  font-semibold text-gray-400">
          <div className="flex gap-2 items-center">
            <ImagePlayIcon size={16} />
            ფოტოები ნაჩვენები იქნება მონიშნული ლოკაციის 10 მეტრიან რადიუსში
          </div>
          <div className="flex gap-2 items-center w-full">
            <Clock size={16} />
            დრო ნაჩვენები იქნება 10 წუთიანი ინტერვალით
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SidebarTutorial() {
  return (
    <>
      <SidebarTutorialDesktop />
      <SidebarTutorialMob />
    </>
  );
}
