import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

// Define the auth configuration interface
interface AuthConfig {
  redirectUrl?: string; // Optional redirect URL
}

// Modify the HOC to accept both AuthConfig and generic props
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  authConfig: AuthConfig = {} // Default empty config
) {
  return function WithAuth(props: P) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const redirectUrl = authConfig.redirectUrl || "/login"; // Use custom URL or default to /login

    useEffect(() => {
      if (status === "loading") return;
      if (!session) {
        router.replace(redirectUrl);
      }
    }, [session, status, router, redirectUrl]);

    if (status === "loading") {
      return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-950 absolute top-0 left-0">
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
