import { clsx, type ClassValue } from "clsx";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns-tz/format";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function urlBuilder(photoId: string, userId: string) {
  const publicURL = process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_URL!;
  const bucketName = process.env.NEXT_PUBLIC_CLOUDFLARE_PUBLIC_BUCKET!;
  return `${publicURL}/${bucketName}/${userId}/${photoId}`;
}

export const formatDateWithTimezone = (dateInput: Date | string): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Detect user's timezone (this is a browser-specific method)
  const { timeZone: userTimezone } = Intl.DateTimeFormat().resolvedOptions();

  // Format the date using the detected timezone
  const formattedDate = format(
    toZonedTime(date, userTimezone),
    "dd MMM yyyy. HH:mm",
    {
      timeZone: userTimezone,
    }
  );

  return formattedDate;
};
