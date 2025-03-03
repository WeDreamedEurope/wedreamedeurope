import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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
        <PopoverContent asChild className="bg-black border-none min-w-[200px] text-gray-200" align="end">
          <div className="flex flex-col gap-2 bg-black">
            Lorem ipsum dolor sit amet.
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
