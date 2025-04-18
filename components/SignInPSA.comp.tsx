import { CheckIcon } from "lucide-react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

export default function SignInPSA() {
  return (
    <article className="sm:mx-auto max-w-2xl  ">
      <div className="bg-[#2F3727] text-white p-4 rounded-lg font-semibold">
        <div className="text-center">
          ფოტოების ასატვირთად საჭიროა Google ანგარიშით ავტორიზაცია
        </div>
        <section className="mt-4 text-sm flex flex-col gap-3">
          <div className="flex gap-1 items-center text-gray-100 font-normal">
            <span className="flex-shrink-0">
              <CheckIcon size={16} />
            </span>
            ანგარიში არის სრულიად ანონიმური
          </div>
          <div className="flex gap-1 items-center text-gray-100 font-normal">
            <span className="flex-shrink-0">
              <CheckIcon size={16} />
            </span>
            შეგიძლიათ წაშალოთ ერთი დაკლიკებით
          </div>
          <div className="inline-flex gap-1 items-start text-gray-100 font-normal">
            <span className="flex-shrink-0">
              <CheckIcon size={16} />
            </span>
            მხოლოდ გამოიყენება სპამისგან თავის დასაცავად
          </div>
        </section>
        <footer className="mt-6 flex w-full items-center justify-center">
          <Button
            onClick={() => signIn("google")}
            className="bg-white hover:bg-gray-100 text-gray-800 font-medium py-1.5 px-4 border border-gray-300 rounded-md shadow-sm flex items-center space-x-2 h-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4 mr-2"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue Google Account
          </Button>
        </footer>
      </div>
    </article>
  );
}
