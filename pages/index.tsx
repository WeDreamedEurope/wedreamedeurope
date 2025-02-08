import Image from "next/image";
import { Geist, Geist_Mono, Noto_Sans_Georgian } from "next/font/google";
import ImagePicker from "@/components/FilePicker.comp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

export default function Home() {
  return (
    <div className="w-[1080px]  mx-auto">
    
    <header className="bg-blue-900 h-20 flex px-4 items-center justify-between">
            Our Struggle
    </header>
      <section className="">
                <ImagePicker />
      </section>
    </div>
  );
}
