import ImagePicker from "@/components/form/FilePicker.comp";
import { Button } from "@/components/ui/button";
import { Noto_Sans_Georgian } from "next/font/google";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

export default function Home({
  userSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const HeaderComp = () => {
    return (
      <header className="bg-gray-950 border-b border-b-blue-500 h-header-height flex-none flex px-4 items-center justify-between">
        <div>We Dreamed Europe</div>
        <Button onClick={() => signIn()}>Log In Baby</Button>
      </header>
    );
  };

  useEffect(() => {
    console.log(userSession);
  }, []);

  return (
    <div className={`h-full flex flex-col ${notoGeorgian.className}  `}>
      <HeaderComp />
      <section className=" flex-1 flex  overflow-auto">
        <ImagePicker userId={userSession?.user?.id!} />
      </section>
    </div>
  );
}

export const getServerSideProps = (async (ctx: GetServerSidePropsContext) => {
  const userSession = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!userSession) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      userSession,
    },
  };
}) satisfies GetServerSideProps<{ userSession: Session }>;
