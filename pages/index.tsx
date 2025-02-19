import ImagePicker from "@/components/form/FilePicker.comp";
import { Button } from "@/components/ui/button";
import { PlusIcon, Upload } from "lucide-react";
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
    <div
      className={` w-full sm:w-[1280px]   mx-auto ${notoGeorgian.className}  h-full`}
    >
      <header className="bg-gray-950 border-b border-b-blue-500 h-12 flex px-4 items-center justify-between  w-f">
        <div>Our Struggle</div>
      </header>
      <section className="  h-full flex pt-20 ">
        
        <ImagePicker />
      </section>
    </div>
  );
}
