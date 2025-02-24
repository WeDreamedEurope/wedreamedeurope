import ImagePicker from "@/components/form/FilePicker.comp";
import { Button } from "@/components/ui/button";
import { Noto_Sans_Georgian } from "next/font/google";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

type propType = {
  message: string;
};

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

export default function Home() {
  const HeaderComp = () => {

    return (
      <header className="bg-gray-950 border-b border-b-blue-500 h-header-height flex-none flex px-4 items-center justify-between">
        <div>We Dreamed Europe</div>
        <Button onClick={() => signIn()}>Log In Baby</Button>
      </header>
    );
  };

  return (
    <div className={`h-full flex flex-col ${notoGeorgian.className}  `}>
      <HeaderComp />
      <section className=" flex-1 flex  overflow-auto">
        <ImagePicker />
      </section>
    </div>
  );
}

export const getServerSideProps = (async (ctx: GetServerSidePropsContext) => {

  return {
    props: {
      message: "Hello",
    },
  };
}) satisfies GetServerSideProps<propType>;
