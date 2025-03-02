import { useDateTimeContext } from "@/context/DateTimeContext";
import { useMapContext } from "@/context/MapContenxt";
import {
  CalendarIcon,
  CameraIcon,
  Clock,
  Clock1,
  Clock10,
  Clock10Icon,
  FileWarning,
  ImageIcon,
  ImagePlayIcon,
  MapIcon,
} from "lucide-react";
import { ClockLoader } from "react-spinners";

export default function Sidebartutorial() {
  const { selectedLocation } = useMapContext();
  const { isValidTime } = useDateTimeContext();
  return (
    <div className="w-full h-full  flex-col  flex items-center justify-center text-gray-200 ">
      <div className="bg-red-[#31363F] p-6">
        <h1 className="font-semibold mb-4">როგორ ვიპოვნოთ ფოტოები</h1>

        <article className="flex flex-col gap-4 text-sm transition-colors ">
          <div
            className={`flex items-center gap-2 ${
              selectedLocation ? "text-green-200" : "text-yellow-200"
            } `}
          >
            <MapIcon size={18} />
            რუკაზე ორჯერ დაკლიკებით მონიშნეთ სასურველი ლოკაცია
          </div>
          <div
            className={`flex items-center gap-2 ${
              isValidTime ? "text-green-200" : "text-yellow-200"
            } `}
          >
            <CalendarIcon size={18} />
            აირჩიეთ თვის სასურველი რიცხვი და დრო
          </div>
        </article>
        <div className="flex flex-col gap-4 mt-4 text-xs bg-gray-800 p-3 opacity-60 rounded-lg items-center font-semibold text-gray-400">
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
    </div>
  );
}
