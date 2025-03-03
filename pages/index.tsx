import { SearchCheck, Upload } from "lucide-react";
import { Noto_Sans_Georgian } from "next/font/google";
import local from "next/font/local";
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

const BPGDeJavuSans = local({
  src: "./BPGDeJavuSans.woff2",
});

export default function Home() {
  return (
    <div className={`h-full w-full  flex flex-col ${notoGeorgian.className}  `}>
      <section className="p-16">
        <h2 className="text-5xl font-bold text">We Dreamed Europe</h2>
        <div className="max-w-2xl mt-4 text-base text-gray-300 leading-relaxed space-y-2">
          ეს პლატფორმა შეიქმნა იმისთვის, რომ დავეხმაროთ ერთმანეთს უსამართლო
          ჯარიმების გასაჩივრებაში. თუ თვლი, რომ უსაფუძვლოდ დაგაჯარიმეს, აქ
          შეგიძლია მოიძიო ფოტო და ვიდეო მტკიცებულებები, რომლებიც დაადასტურებენ
          შენს უდანაშაულობას.
        </div>
      </section>
      <div className="px-16 py-8  text-gray-200 flex gap-6">
        <article className="bg-[#3C3D37] p-4 rounded-lg w-1/2 flex flex-col">
          <h5
            className={`${BPGDeJavuSans.className} text-[10px] text-blue-300 tracking-wider font-semibold`}
          >
            როგორ შეგვიძლია დაგეხმაროთ
          </h5>
          <h2 className="text-xl font-semibold">მოიძიე ფოტო-ვიდეო მასალა</h2>
          <div className="text-sm mt-2 space-y-1 leading-relaxed text-[#e6e7e0] font-medium">
            <p>
              აირჩიე დრო, მონიშნე ლოკაცია და მიიღე სასურველ დროსა და ადგილზე
              გადაღებული ფოტო-ვიდეო მასალა
            </p>
          </div>
          <div className="flex-grow" />
          <footer className="w-full mt-4 flex">
            <Link
              href={"/maptest"}
              className="px-3 h-8 flex items-center rounded-sm bg-[#66d2ce] text-black font-semibold text-xs hover:bg-[#85DBD8] transition-colors  "
            >
              <SearchCheck size={14} />
              მოიძიე
            </Link>
          </footer>
        </article>
        <article className="bg-[#3C3D37] p-4 rounded-lg w-1/2">
          <h5
            className={`${BPGDeJavuSans.className} text-[10px] text-blue-300 tracking-wider font-semibold`}
          >
            როგორ შეგიძლია დაგვეხმარო
          </h5>  
          <h2 className="text-xl font-semibold">ატვირთე ფოტო-ვიდეო მასალა</h2>
          <div className="text-sm mt-2 space-y-1 leading-relaxed text-[#B3B4AC] font-semibold">
            <p>
              ჩვენ გადავამუშავებთ EXIF მონაცემებს (გადაღების დრო და ადგილი) რათა
              უკანონოდ დაჯარიმებულებმა ადვილად მოიძიონ უდანაშაულობის
              დამამტკიცებელი ფოტო-ვიდეო მასალა
            </p>
          </div>
          <footer className="w-full mt-4">
            <button className="px-3 h-8 gap-2 flex items-center rounded-sm bg-[#66d2ce] text-black font-semibold text-xs hover:bg-[#85DBD8] transition-colors  ">
              <Upload size={14} />
              ატვირთვა
            </button>
          </footer>
        </article>
      </div>
    </div>
  );
}
