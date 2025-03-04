import SimpleImageUploader from "@/components/form/SimpIMGUploader.comp";
import SignInPSA from "@/components/SignInPSA.comp";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Noto_Sans_Georgian } from "next/font/google";
import { useEffect, useState } from "react";

const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-georgian",
  subsets: ["georgian"],
});

function UploadThing() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<
    "unauthenticated" | "authenticated" | null
  >(null);
  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
    }

    if (status === "unauthenticated" || status === "authenticated") {
      setIsLoading(false);
      setUserStatus(status);
    }
  }, [status]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${notoGeorgian.className}  `}>
      <section className=" flex-1 flex  overflow-auto">
        {status === "authenticated" ? (
          <SimpleImageUploader userId={session?.user?.id} />
        ) : (
          <span className="translate-y-1/4 w-full px-4">
            <SignInPSA />
          </span>
        )}
      </section>
    </div>
  );
}

export default UploadThing;
// export default withAuth(UploadThing, {
//   redirectUrl: "/upload",
// });
