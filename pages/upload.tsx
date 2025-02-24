import ImagePicker from "@/components/form/FilePicker.comp";
import { Button } from "@/components/ui/button";
import { Noto_Sans_Georgian } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import SimpleImageUploader from "@/components/form/SimpIMGUploader.comp";

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

export default function Home({
  userSession,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className={`h-full flex flex-col ${notoGeorgian.className}  `}>
      <section className=" flex-1 flex  overflow-auto">
        <SimpleImageUploader userId={userSession?.user?.id!} />
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
