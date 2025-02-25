import {
  addMinutes,
  getHours,
  getMinutes,
  isDate,
  setHours,
  setMinutes,
} from "date-fns";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface DateTimeContextType {
  selectedDate: Date | undefined;
  setCurrentDate: (date: Date | undefined) => void;
  hour: string;
  minute: string;
  setHour: (hours: string) => void;
  setMinute: (minutes: string) => void;
  isValidTime: boolean;
  changeTime: (increase: boolean) => void;
  setLocation: (location: [number, number]) => void;
  currentLocation: [number, number] | null;
  setRadius: (radius: number) => void;
  currentRadius: number;
}

const DateTimeContext = createContext<DateTimeContextType | undefined>(
  undefined
);

export function DateTimeProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setCurrentDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string>("");
  const [isValidTime, setIsValidTime] = useState(false);
  const [minute, setMinute] = useState<string>("");
  const [currentLocation, setLocation] = useState<[number, number] | null>(
    null
  );
  const [currentRadius, setRadius] = useState<number>(10);
  useEffect(() => {
    const validTime = checkTimeValidity(hour, minute);
    if (validTime && isDate(selectedDate)) {
      const dateWithMinutes = setMinutes(selectedDate, parseInt(minute));
      const dateWithHours = setHours(dateWithMinutes, parseInt(hour));
      setCurrentDate(dateWithHours);
      console.log(`We Have Valid Time And Date!`);
      console.log(dateWithHours);
      setIsValidTime(checkTimeValidity(hour, minute));
    }
  }, [hour, minute]);

  /**
   * This method checks if the given time in format "HH:MM" is valid.
   * It returns true if the time is valid and false otherwise.
   * Valid time is considered time between 00:00 and 23:59.
   * @param hours - hours in 24-hour format
   * @param minutes - minutes
   * @returns true if the time is valid and false otherwise
   */
  const checkTimeValidity = (hours: string, minutes: string) => {
    const timeRegex = /^([01]?\d|2[0-3]):([0-5]?\d)$/;
    return timeRegex.test(`${hours}:${minutes}`);
  };

  /**
   * This method changes the time by adding or subtracting 10 minutes.
   * It checks if the time is valid and if the selected date is a valid Date object.
   * If the time is valid, it sets the new date with the updated time.
   * @param increase - boolean indicating whether to increase or decrease the time
   */
  const changeTime = (increase: boolean) => {
    if (isValidTime && isDate(selectedDate)) {
      const newDate = addMinutes(selectedDate, increase ? 10 : -10);
      setCurrentDate(newDate);
      setHour(getHours(newDate).toString());
      setMinute(getMinutes(newDate).toString());
    }
  };

  return (
    <DateTimeContext.Provider
      value={{
        selectedDate,
        setCurrentDate,
        hour,
        minute,
        setHour,
        setMinute,
        isValidTime,
        changeTime,
        setLocation,
        currentLocation,
        setRadius,
        currentRadius,
      }}
    >
      {children}
    </DateTimeContext.Provider>
  );
}

export function useDateTimeContext() {
  const context = useContext(DateTimeContext);
  if (context === undefined) {
    throw new Error(
      "useDateTimeContext must be used within a DateTimeProvider"
    );
  }
  return context;
}
