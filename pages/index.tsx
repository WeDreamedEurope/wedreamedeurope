import {
  SearchCheck,
  UploadCloudIcon
} from "lucide-react";
import { Noto_Sans_Georgian } from "next/font/google";
import Link from "next/link";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});


// linear-gradient(191deg, hsl(224 45% 15% / 1) 27%, transparent)
export default function Home() {
  return (
    <div
      className={`h-full w-full  flex flex-col ${notoGeorgian.className} max-w-7xl mx-auto`}
    >
      <section className="p-16 flex flex-col items-center  mt-20">
        <h2 className="text-5xl font-bold text">We Dreamed Europe</h2>
        <div className="max-w-2xl mt-4 text-base text-gray-300 leading-relaxed space-y-2 text-center">
          ეს პლატფორმა შეიქმნა, რომ დავეხმაროთ ერთმანეთს უსამართლო ჯარიმების
          გასაჩივრებაში. თუ თვლი, რომ უსაფუძვლოდ დაგაჯარიმეს, აქ შეგიძლია მოიძიო
          ფოტო და ვიდეო მტკიცებულებები, რომლებიც დაადასტურებენ შენს
          უდანაშაულობას.
        </div>
      </section>
      <div className=" max-w-5xl mx-auto  text-gray-200 flex gap-6 ">
        <Link
          href={"/maptest"}
          // light yellow - #fecf8a
          // default yellow - #a16207
          style={{
            // background:'linear-gradient(191deg, hsl(35 45% 15% / 1) 27%, #181f35)'
            background: "hsl(35 45% 15% / 1)",
          }}
          className=" p-4 rounded-lg w-1/2 flex flex-col  items-center bg-yellow-700 border  border-yellow-950 "
        >
          <div className="flex flex-col items-center gap-2 text-yellow-200">
            <SearchCheck size={64} />
            <h2 className="text-2xl font-semibold">მოიძიე ფოტო-ვიდეო მასალა</h2>
          </div>
          <div className="text-sm text-center mt-2 space-y-1 leading-relaxed text-[#e6e7e0] font-medium">
            <p>
              აირჩიე დრო, მონიშნე ლოკაცია და მიიღე სასურველ დროსა და ადგილზე
              გადაღებული ფოტო-ვიდეო მასალა
            </p>
          </div>
          <div className="flex-grow" />
          <footer className="w-full mt-4 flex">
            {/* <Link
              href={"/maptest"}
              className="px-3 h-8 flex items-center rounded-sm bg-[#66d2ce] text-black font-semibold text-xs hover:bg-[#85DBD8] transition-colors  "
            >
              <SearchCheck size={14} />
              მოიძიე
            </Link> */}
          </footer>
        </Link>
        <Link
          href={"/upload"}
          style={{
            // background:'linear-gradient(191deg, hsl(224 45% 15% / 1) 27%, #372915)'
            background: "hsl(224 45% 15% / 1)",
          }}
          className=" p-4 rounded-lg w-1/2 bg-blue-700 border  border-blue-950"
        >
          <div className="flex flex-col items-center gap-2 text-blue-200">
            <UploadCloudIcon size={64} />
            <h2 className="text-2xl font-semibold">ატვირთე მასალა</h2>
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
