import { Photo_Location_Select_With_URL } from "@/API_CALLS/gis_query";
import userClient from "@/API_CALLS/user/user.client";
import Slideshow from "@/components/Slideshow";
import { Button } from "@/components/ui/button";
import { withAuth } from "@/components/WithAuth.com";
import database from "@/db/db";
import { photoLocations } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { formatDateWithTimezone, urlBuilder } from "@/lib/utils";

type PhotoCardProps = {
  src: string;
  id: number;
  isDeleting: boolean;
  onClick: (arg: number) => void;
  onDelete: (arg: number) => void;
  index: number;
};

const PhotoCard = ({
  src,
  id,
  index,
  isDeleting,
  onClick,
  onDelete,
}: PhotoCardProps) => {
  return (
    <div
      onClick={() => onClick(index)}
      className={`group relative overflow-hidden rounded-md hover:cursor-pointer ${
        isDeleting && "opacity-30"
      } transition-opacity`}
    >
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
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const Profile = ({ photos }: { photos: Photo_Location_Select_With_URL[] }) => {
  const [uploadedPhotos, setUploadedPhotos] =
    useState<Photo_Location_Select_With_URL[]>(photos);
  const { data: session } = useSession();
  const [startSlideShow, setStartSlideShow] = useState(false);
  const [, setSelectedPhotoIndex] = useState<number | null>(null);
  const [toBeDeleted, setToBeDeleted] = useState<number[]>([]);
  const handlePhotoClick = (index: number) => {
    console.log(index);
    setSelectedPhotoIndex(index);
    setStartSlideShow(true);
  };

  async function handleDeletePhoto(photoRecordId: number) {
    setToBeDeleted((prev) => [...prev, photoRecordId]);
    (await userClient.DeletePhotos(
      photoRecordId,
      session?.user.id as string
    )) as Photo_Location_Select_With_URL[];

    setUploadedPhotos((photos) =>
      photos.filter((photo) => photo.id !== photoRecordId)
    );
  }

  return (
    <div className="flex flex-col   mt-8     w-full max-w-6xl mx-auto  relative">
      {startSlideShow && (
        <Slideshow
          isOpen={startSlideShow}
          onDismiss={() => setStartSlideShow(false)}
          slides={uploadedPhotos}
        />
      )}
      {/* Profile Header */}
      <article className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
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
          <h1 className="text-2xl font-bold">{session?.user.name}</h1>
          <p className="text-muted-foreground">კონტრიბუტორი </p>
        </div>
      </article>
      {/* Photos Section */}
      <section className="flex flex-col  p-4 rounded-lg mt-5 ">
        <section className="flex items-center justify-between mb-4 ">
          <h1 className="text-xl font-semibold ">ბოლოს ატვირთული </h1>
          {/* <Button size={"sm"} variant={"destructive"}>
            ფოტოების წაშლა
          </Button> */}
        </section>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-flow-row  sm:grid-cols-4 gap-4"
        >
          {uploadedPhotos.map((file, index) => (
            <PhotoCard
              key={index}
              src={file.url}
              id={file.id}
              onClick={handlePhotoClick}
              onDelete={handleDeletePhoto}
              index={index}
              isDeleting={toBeDeleted.includes(file.id)}
            />
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default withAuth(Profile);

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  // Fetch data from external API
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  let photos: Photo_Location_Select_With_URL[] = [];

  const userPhotos = await database
    .select()
    .from(photoLocations)
    .where(
      and(
        eq(photoLocations.userId, session.user.id),
        eq(photoLocations.userId, session.user.id)
      )
    );

  if (photos.length === 0) {
    const mappedURLS = userPhotos.map<Photo_Location_Select_With_URL>(
      (file) => ({
        ...file,
        url: urlBuilder(file.photoId, session.user.id),
        distance: 0,
        dateTakenAt: formatDateWithTimezone(file.dateTakenAt!),
      })
    );
    photos = mappedURLS;
  }

  return { props: { photos } };
}) satisfies GetServerSideProps<{ photos: Photo_Location_Select_With_URL[] }>;
