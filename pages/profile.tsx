import { Button } from "@/components/ui/button";
import { withAuth } from "@/components/WithAuth.com";
import testImage from "@/public/someimage.jpg";
import { Trash } from "lucide-react";
import Image from "next/image";
const Profile = () => {
  return (
    <div className="flex flex-col   mt-8 w-full  sm:mx-auto max-w-5xl ">
      <section className="flex flex-col bg-green-500/10 p-4 rounded-lg ">
        <section className="flex items-center justify-between mb-4">
          <h1 className="text-base font-semibold ">ბოლოს ატვირთული ფოტოები</h1>
          <Button size={"sm"} variant={'destructive'}>ფოტოების წაშლა</Button>
        </section>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 10 }).map((_, index) => (
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
                src={
                  "https://images.unsplash.com/photo-1513894697031-3e3aa4c54326?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
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
