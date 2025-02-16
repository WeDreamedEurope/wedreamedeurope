import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DatePickerCustom } from "./DatePickerCustom";
import { TimePickerCustom } from "./TimePickerCustom";
import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { useDateTimeContext } from "@/context/DateTimeContext";

const FomrHeaderDesktop = () => {
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
        <Button>მოძებნე</Button>
      </div>
    </section>
  );
};

const FormHeaderMobile = () => {
//   const { selectedDate, setCurrentDate } = useDateTimeContext();
  const [selectedDate, setCurrentDate] = useState<Date | undefined>(undefined);
  return (
    <div className="flex sm:hidden w-full h-20 items-center justify-center px-4 bg-purple-600">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusIcon /> მონიშნე თარიღი და დრო{" "}
          </Button>
        </DialogTrigger>
        <DialogContent className=" border-none bg-black max-w-[400px] rounded-md ">
          <DialogHeader>
            <DialogTitle className="text-left">I Am Dialog Header</DialogTitle>
          </DialogHeader>
          <DialogDescription hidden={true}>
            დაამატე დიალოგის რაღაცეები
          </DialogDescription>
          <div className=" ">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setCurrentDate}
             
            />
          </div>
          <DialogFooter>
            <Button>მოძებნე</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function FormHeader() {
  return (
    <>
      <FomrHeaderDesktop />
      <FormHeaderMobile />
    </>
  );
}
