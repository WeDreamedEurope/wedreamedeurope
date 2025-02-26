import {
  CalendarIcon,
  FileWarning,
  Info,
  InfoIcon,
  MapIcon,
  Triangle,
  TriangleAlert,
  WarehouseIcon,
} from "lucide-react";

export default function Sidebartutorial() {
  return (
    <div className="w-full h-full  flex-col  flex items-center justify-center text-gray-200 ">
      <div className="bg-gray-900 p-6">
        <h1 className="font-semibold mb-4">როგორ ვიპოვნოთ ფოტოები</h1>
        <article className="flex flex-col gap-4 text-sm ">
          <div className="flex items-center gap-2 text-yellow-200">
            <MapIcon size={18} />
            რუკაზე ორჯერ დაკლიკებით მონიშნეთ სასურველი ლოკაცია
          </div>
          <div className="flex items-center gap-2 text-yellow-200">
            <CalendarIcon size={18} />
            აირჩიეთ თვის სასურველი რიცხვი და დრო
          </div>
        </article>
        <div className="flex gap-2 mt-4 text-xs bg-gray-800 p-2 rounded-lg items-center font-semibold text-gray-400">
          <FileWarning size={16} />
          ფოტოები ნაჩვენები იქნება მონიშნული ლოკაციის 10 მეტრიან რადიუსში
        </div>
      </div>
    </div>
  );
}
