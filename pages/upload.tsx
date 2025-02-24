import ImagePicker from "@/components/form/FilePicker.comp";
import { Noto_Sans_Georgian } from "next/font/google";

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

export default function Home() {
  return (
    <div className={`h-full flex flex-col ${notoGeorgian.className}  `}>
      <header className="bg-gray-950 border-b border-b-blue-500 h-header-height flex-none flex px-4 items-center justify-between">
        <div>We Dreamed Europe</div>
      </header>
      <section className=" flex-1 flex  overflow-auto">
        <ImagePicker />
      </section>
    </div>
  );
}
