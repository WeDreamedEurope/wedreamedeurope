import { Button } from "@/components/ui/button";
import { DatePickerCustom } from "../DatePickerCustom";
import { TimePickerCustom } from "../TimePickerCustom";
import { useDateTimeContext } from "@/context/DateTimeContext";

const FomrHeaderDesktop = () => {


  const {isValidTime} = useDateTimeContext()
  return (
    <section className="hidden w-full min-h-20 items-center sm:flex   px-4   sm:gap-6 h-20   ">
      <div className="  flex-shrink-0">
        <DatePickerCustom />
      </div>
      <div className="py-2 uppercase font-semibold text-lg space-y-2 text-gray-300  flex items-center flex-col ">
        <div className="flex gap-1">
          <TimePickerCustom />
        </div>
      </div>
      <div>
        <Button disabled={!isValidTime} variant={"secondary"}>
          მოძებნე
        </Button>
      </div>
    </section>
  );
};

export default FomrHeaderDesktop;
