import { CameraIcon, MapPinCheckIcon } from "lucide-react";
import { Noto_Sans_Georgian } from "next/font/google";
import Link from "next/link";
const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});
export default function Login() {
  return (
    <div
      className={`w-full h-full flex items-center justify-center  ${notoGeorgian.className} px-4 flex-col gap-4 text-gray-400`}
    >
      <Link
        href={"/upload"}
        className="bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors max-w-lg flex rounded-lg p-4 border border-gray-600  w-full  flex-col"
      >
        <div className="flex gap-2">
          <CameraIcon />
          <h2 className="font-semibold">ატვირთე ფოტოები</h2>
        </div>
        <div className="text-xs text-gray-300 mt-4 leading-relaxed">
          <span>
            ატვირთე აქციაზე გადაღებული ფოტოები და დაეხმარე შენს თანამოაზრეებს
            დაამტკიცონ უდანაშაულობა სასამართლოს წინაშე.{" "}
            <span className=" cursor-pointer font-bold text-blue-500">
              გაიგე დეტალუტად
            </span>
          </span>
          <div className="mt-3 font-bold italic text-yellow-700">
            საჭიროებს Google-ით ავტორიზაციას
          </div>
        </div>
      </Link>
      <Link
        href="/maptest"
        className="bg-gray-900 cursor-pointer hover:bg-gray-800 transition-colors flex rounded-lg p-4 border border-gray-600  w-full  flex-col max-w-lg"
      >
        <div className="flex gap-2">
          <MapPinCheckIcon />
          <h2 className="font-semibold">იპოვნე ფოტოები</h2>
        </div>
        <div className="text-xs text-gray-300 mt-4 leading-relaxed">
          თუ სასამართლო გზის უკანონოდ გადაკეტვას გედავება აქ შეგიძლია იპოვნო
          ფოტოები ლოკაციის, თარიღის და დროის მიხედვით
        </div>
      </Link>
    </div>
  );
}






