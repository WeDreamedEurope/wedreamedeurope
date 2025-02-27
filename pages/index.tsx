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
      <section className=" flex-1 flex  overflow-auto">
        <ImagePicker userId="" />
      </section>
    </div>
  );
}
