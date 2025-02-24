import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="bg-gray-950 border-b border-b-blue-500 h-header-height flex-none flex px-4 items-center justify-between">
      <div>We Dreamed Europe</div>
      {session?.user ? (
        <Button
          onClick={() =>
            signOut({
              redirect: true,
            })
          }
        >
          Log Out Baby
        </Button>
      ) : (
        <Button onClick={() => signIn("google")}>Log In Baby</Button>
      )}
    </header>
  );
}
