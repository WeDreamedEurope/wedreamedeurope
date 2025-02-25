import SimpleImageUploader from "@/components/form/SimpIMGUploader.comp";
import { withAuth } from "@/components/WithAuth.com";
import { useSession } from "next-auth/react";
import { Noto_Sans_Georgian } from "next/font/google";

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

function UploadThing() {
  const { data: session } = useSession({ required: true });
  return (
    <div className={`h-full flex flex-col ${notoGeorgian.className}  `}>
      <section className=" flex-1 flex  overflow-auto">
        <SimpleImageUploader userId={session!.user.id} />
      </section>
    </div>
  );
}

export default withAuth(UploadThing);
