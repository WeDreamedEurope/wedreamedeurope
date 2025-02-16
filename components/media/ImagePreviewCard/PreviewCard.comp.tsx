import { Calendar } from "@/components/ui/calendar";
import { format, setHours, setMinutes } from "date-fns";
import { ka } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Modal from "../Moda.com";
import MapComponent from "../map";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ProgressScreen from "./ProgresScreen.comp";
type Props = {
  url: string;
  name: string;
  DateTaken: Date | null;
  onDelete: () => void;
  location: [number, number] | null;
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
};

type LocationBtnProps = {
  onClick: () => void;
  disabled: boolean;
  hasContent: boolean;
};

const LocationButton = ({
  onClick,
  disabled,
  hasContent,
}: LocationBtnProps) => {
  const renderLabel = () => {
    return hasContent ? (
      <span>რუკაზე ნახვა</span>
    ) : (
      <span>მონიშნე ლოკაცია</span>
    );
  };
  return (
    <Button
      disabled={disabled}
      variant={"ghost"}
      className={`   ${
        hasContent ? "text-green-300" : "text-yellow-500"
      } font-semibold  disabled:opacity-40`}
      onClick={onClick}
    >
      {renderLabel()}
    </Button>
  );
};

export function ImagePreviewCard({
  url,
  onDelete,
  DateTaken,
  location,
  status,
  progress,
}: Props) {
  const [date, setDate] = useState<Date | null>(DateTaken);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoLocation, setPhotoLocation] = useState(location);
  return (
    <>
      <div className="flex flex-col w-full aspect-video   relative  ">
      
        <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
          <Image
            src={url}
            fill
            className="w-full object-cover"
            alt=""
            onClick={(e) => {
              if (e.ctrlKey) {
                onDelete();
              }
            }}
          />
        </div>
        <footer className="   bg-gray-900 relative w-full ">
          {status !== "idle" && <ProgressScreen percent={progress} />}
          <div className="flex justify-between items-center p-2">
            <Popover onOpenChange={(e) => console.log(e)}>
              <PopoverTrigger asChild>
                <Button
                  title="EXIF Data Exists"
                  disabled={DateTaken ? true : false}
                  variant={"ghost"}
                  className={`  w-auto justify-start text-left font-normal  disabled:opacity-40`}
                >
                  <CalendarIcon className=" " />
                  {date ? (
                    format(date, "dPP", { locale: ka })
                  ) : (
                    <span>აირჩიე თარიღი</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  disabled={DateTaken ? true : false}
                  mode="single"
                  selected={date!}
                  onSelect={(e) => {
                    console.log(e);

                    setDate(e!);
                  }} // onSelect
                  initialFocus
                />
                <div className="h-12 flex items-center px-4 ">
                  <div className="flex items-center">
                    {/* <Clock size={16} className="mr-2" /> */}
                    <div className="space-x-2">
                      <input
                        placeholder="HH"
                        className="border w-auto border-black p-1"
                        type="number"
                        min={0}
                        max={23}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            console.log(
                              `%cWe Have Prevented Something!`,
                              "color:yellow"
                            );
                            return;
                          }
                          console.log(`Hour`, e.target.value);
                          setDate((prev) => {
                            if (!prev) return prev;
                            return setHours(prev, parseInt(e.target.value));
                          });
                        }}
                      />
                      <input
                        placeholder="MM"
                        className="border w-auto border-black p-1"
                        type="number"
                        min={0}
                        max={59}
                        onChange={(e) => {
                          console.log(`This Is Minutes Thing`);
                          console.log(e.target.value);
                          setDate((prev) => {
                            if (!prev) return prev;
                            return setMinutes(prev, parseInt(e.target.value));
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
              <LocationButton
                onClick={() => {
                  setModalIsOpen(true);
                }}
                hasContent={photoLocation ? true : false}
                disabled={location ? true : false}
              />
            </Popover>
          </div>
        </footer>
      </div>
      <Modal
        onOpen={() => setModalIsOpen((e) => !e)}
        title="Select Location"
        isOpen={modalIsOpen}
      >
        <div className="w-full aspect-video ">
          <MapComponent
            isInteractive={location ? false : true}
            defaultLocation={location ? location : null}
            onNewCoordinates={(coordinates) =>
              setPhotoLocation([...coordinates])
            }
          />
          <footer className="w-full mt-4 flex justify-center">
            <Button onClick={() => setModalIsOpen(false)}>Save</Button>
          </footer>
        </div>
      </Modal>
    </>
  );
}
