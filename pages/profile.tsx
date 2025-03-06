import { Button } from "@/components/ui/button";
import { withAuth } from "@/components/WithAuth.com";
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type FileFromLocalStorage = {
  name: string;
  extension: string;
};

const Profile = () => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const { data: session } = useSession();

  useEffect(() => {
    const filesFromLocalStorage = JSON.parse(
      localStorage.getItem("uploadedFiles") || "[]"
    );
    if (session?.user && Array.isArray(filesFromLocalStorage)) {
      const publicURL = process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL!;
      const bucketName = process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_BUCKET!;
      const url = `${publicURL}/${bucketName}/${session.user.id}/`;
      const mappedURLS = filesFromLocalStorage.map((file) => `${url}${file}`);
      console.log(mappedURLS);
      setUploadedFiles(mappedURLS);
    }
  }, [session]);

  return (
    <div className="flex flex-col   mt-8 w-full  sm:mx-auto max-w-5xl ">
      <section className="flex flex-col bg-green-500/10 p-4 rounded-lg ">
        <section className="flex items-center justify-between mb-4">
          <h1 className="text-base font-semibold ">ბოლოს ატვირთული ფოტოები</h1>
          <Button size={"sm"} variant={"destructive"}>
            ფოტოების წაშლა
          </Button>
        </section>
        <div className="grid grid-cols-4 gap-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="w-full aspect-video object-cover relative"
            >
              <div className="absolute top-2 right-2  flex items-center justify-center w-4 h-4 p-4 bg-red-500/50 backdrop-blur-sm rounded-full z-50">
                <button>
                  <Trash size={16} />
                </button>
              </div>
              <Image
                fill
                src={file}
                alt="test"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default withAuth(Profile);
