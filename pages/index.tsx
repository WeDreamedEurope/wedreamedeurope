import { SearchCheck, UploadCloudIcon } from "lucide-react";
import { Noto_Sans_Georgian } from "next/font/google";
import Link from "next/link";

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

// linear-gradient(191deg, hsl(224 45% 15% / 1) 27%, transparent)
export default function Home() {
  return (
    <div
      className={` h-auto w-full  flex flex-col ${notoGeorgian.className} max-w-7xl mx-auto  pb-20 sm:pb-0 overflow-auto`}
    >
      <section className="sm:p-16 p-6 flex flex-col sm:items-center  mt-20 mb-12">
        <h2 className="sm:text-5xl font-bold  sm:text-center text-2xl text-left">
          We Dreamed Europe
        </h2>
        <div className="max-w-2xl mt-4 sm:text-base text-sm text-gray-300 leading-relaxed space-y-2 sm:text-center">
          ეს პლატფორმა დაგეხმარებათ უსამართლო ჯარიმების გასაჩივრებაში. თუ თვლი,
          რომ უსაფუძვლოდ დაგაჯარიმეს, აქ შეგიძლია მოიძიო ფოტო და ვიდეო
          მტკიცებულებები, რომლებიც დაადასტურებენ შენს უდანაშაულობას.
        </div>
      </section>
      <div className=" max-w-5xl mx-auto  text-gray-200 flex gap-6 flex-col sm:flex-row  px-4 sm:p-0  ">
        <Link
          href={"/searchmaterial"}
          // light yellow - #fecf8a
          // default yellow - #a16207
          style={{
            // background:'linear-gradient(191deg, hsl(35 45% 15% / 1) 27%, #181f35)'
            background: "hsl(35 45% 15% / 1)",
          }}
          className=" p-4 rounded-lg w-full  sm:w-1/2 flex flex-col  items-center bg-yellow-700 border  border-yellow-950 "
        >
          <div className="flex flex-col items-center gap-2 text-yellow-200">
            <SearchCheck size={64} />
            <h2 className=" text-xl sm:text-2xl font-semibold text-center">
              მოიძიე ფოტო-ვიდეო მასალა
            </h2>
          </div>
          <div className="text-sm text-center mt-2 space-y-1 leading-relaxed text-[#e6e7e0] font-medium">
            <p>
              აირჩიე დრო, მონიშნე ლოკაცია და მიიღე სასურველ დროსა და ადგილზე
              გადაღებული ფოტო-ვიდეო მასალა
            </p>
          </div>
          <div className="flex-grow" />
        </Link>
        <Link
          href={"/upload"}
          style={{
            // background:'linear-gradient(191deg, hsl(224 45% 15% / 1) 27%, #372915)'
            background: "hsl(224 45% 15% / 1)",
          }}
          className=" p-4 rounded-lg sm:w-1/2 w-full bg-blue-700 border  border-blue-950"
        >
          <div className="flex flex-col items-center gap-2 text-blue-200">
            <UploadCloudIcon size={64} />
            <h2 className=" text-xl sm:text-2xl font-semibold">
              ატვირთე მასალა
            </h2>
          </div>
          <div className="text-sm mt-2 space-y-1 leading-relaxed text-[#B3B4AC] font-semibold text-center">
            <p>
              ჩვენ გადავამუშავებთ EXIF მონაცემებს (გადაღების დრო და ადგილი) რათა
              უკანონოდ დაჯარიმებულებმა ადვილად მოიძიონ უდანაშაულობის
              დამამტკიცებელი ფოტო-ვიდეო მასალა
            </p>
          </div>
          <footer className="w-full mt-4"></footer>
        </Link>
      </div>
    </div>
  );
}
