import Image from "next/image";
import { Geist, Geist_Mono, Noto_Sans_Georgian } from "next/font/google";
import ImagePicker from "@/components/FilePicker.comp";
import { Button } from "@/components/ui/button";
import { Plus, PlusIcon, Upload } from "lucide-react";

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
    <div className={`w-[1280px]   mx-auto ${notoGeorgian.className}`}>
      <header className="bg-blue-900 h-20 flex px-4 items-center justify-between">
        Our Struggle
      </header>
      <section className=" ">
        <section className="w-full flex items-center justify-end px-4 bg-yellow-900 gap-2">
          <Button size={"lg"} variant={"default"} className="items-center flex">
            <Upload size={24} className="translate-y-[2px]" />
            <span> ატვირთვა</span>
          </Button>
          <Button size={"lg"}  variant={"default"} className="items-center flex">
            <PlusIcon size={24} className="translate-y-[2px]" />
            <span>ფოტოების დამატება</span>
          </Button>
        </section>
        <ImagePicker />
      </section>
    </div>
  );
}
