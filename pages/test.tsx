import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "@radix-ui/react-popover";

export default function Test() {
  const MainContent = () => {
    return (
      <h2 className="text-2xl font-semibold text-yellow-50 bg-red-500">
        I Am Test
      </h2>
    );
  };

  return (
    <>
      <div className="hidden sm:block">{MainContent()}</div>
      <div className="block sm:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button size={"lg"}>გასხენი</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto" align="start">
            <MainContent />
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
