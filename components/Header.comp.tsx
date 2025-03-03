import { ArrowRight, Trash, UserIcon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import local from "next/font/local";
import Link from "next/link";
import { useRouter } from "next/router";

const BPGDeJavuSans = local({
  src: "./BPGDeJavuSans.woff2",
});

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className=" h-header-height flex-none flex px-4 items-center justify-between">
      <div>We Dreamed Europe</div>
      {session?.user ? (
        <UserExists profileUrl={session.user.image!} />
      ) : (
        <button
          className="text-white font-semibold"
          onClick={() => signIn("google")}
        >
          შესვლა
        </button>
      )}
    </header>
  );
}

const UserExists = ({ profileUrl }: { profileUrl: string }) => {
  const router = useRouter();

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            // onClick={() => signOut()}
            className="w-8 h-8 rounded-full overflow-hidden relative"
          >
            <Image src={profileUrl} alt="profile" fill />
          </button>
        </PopoverTrigger>
        <PopoverContent
          asChild
          className={`bg-[#47533B] text-sm border-none min-w-[200px] w-auto text-gray-200 h-auto  ${BPGDeJavuSans.className}`}
          align="end"
        >
          <div className="flex flex-col gap-2 bg-black">
            <Link
              href={"/profile"}
              className={`h-10  items-center px-2 gap-2 hover:text-gray-300 ${
                router.pathname === "/profile" ? "hidden" : "flex"
              }`}
            >
              <UserIcon size={16} />
              პროფილი
            </Link>
            <button
              onClick={() => signOut()}
              className="h-10 flex  px-2 gap-2 items-center text-red-400 hover:text-red-500"
            >
              <span className="">
                <Trash size={16} />
              </span>
              <span className="">პროფილის წაშლა</span>
            </button>
            <button
              onClick={() => signOut()}
              className="h-10 flex  px-2 gap-2 items-center hover:text-gray-300"
            >
              <ArrowRight size={16} />
              გამოსვლა
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
