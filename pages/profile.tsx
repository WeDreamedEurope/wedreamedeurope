import { Button } from "@/components/ui/button";
import { withAuth } from "@/components/WithAuth.com";
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const PhotoCard = ({ src }: { src: string }) => {
  return (
    <div className="group relative overflow-hidden rounded-md hover:cursor-pointer">
      <Image
        src={src}
        alt="test"
        width={300}
        height={300}
        className="w-full h-full object-cover  aspect-square transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-start justify-end p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => alert(`We Are Deleting!`)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
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
      setUploadedFiles(mappedURLS);
    }
  }, [session]);

  return (
    <div className="flex flex-col   mt-8   sm:mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-full">
          <Image
            src={session?.user?.image || "/placeholder.svg?height=96&width=96"}
            alt="Profile"
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col  items-center sm:items-start">
          <h1 className="text-2xl font-bold">Jane Doe</h1>
          <p className="text-muted-foreground">Photographer & Visual Artist</p>
        </div>
      </div>
      <section className="flex flex-col  p-4 rounded-lg ">
        <section className="flex items-center justify-between mb-4 ">
          <h1 className="text-xl font-semibold ">ბოლოს ატვირთული </h1>
          {/* <Button size={"sm"} variant={"destructive"}>
            ფოტოების წაშლა
          </Button> */}
        </section>
        <div className="grid grid-cols-2  sm:grid-cols-4 gap-4">
          {uploadedFiles.map((file, index) => (
            <PhotoCard key={index} src={file} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default withAuth(Profile);
