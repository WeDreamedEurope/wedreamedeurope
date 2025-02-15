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
}

const DateTimeContext = createContext<DateTimeContextType | undefined>(
  undefined
);

export function DateTimeProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setCurrentDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [isValidTime, setIsValidTime] = useState(false);
  useEffect(() => {
    const validTime = checkTimeValidity(hour, minute);
    if (validTime && isDate(selectedDate)) {
      const dateWithMinutes = setMinutes(selectedDate, parseInt(minute));
      const dateWithHours = setHours(dateWithMinutes, parseInt(hour));
      setCurrentDate(dateWithHours);
      console.log(`We Have Valid Time And Date!`);
      console.log(dateWithHours);
    }
    setIsValidTime(checkTimeValidity(hour, minute));
  }, [hour, minute]);

  const checkTimeValidity = (hours: string, minutes: string) => {
    const timeRegex = /^([01]?\d|2[0-3]):([0-5]?\d)$/;
    return timeRegex.test(`${hours}:${minutes}`);
  };

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
