import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;
      if (!session) {
        router.replace("/login");
      }
    }, [session, status, router]);

    if (status === "loading") {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="text-blue-500 text-xl font-semibold">Loading...</p>
          </div>
        </div>
      );
    }

    if (!session) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
