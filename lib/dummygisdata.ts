import { Photo_Location_Insert } from "@/API_CALLS/gis_query";
export function generateRandomData(
  count = 10,
  hourFrom = 19,
  minuteFrom = 0,
  hourTo = 21,
  minuteTo = 0,
  lat: number,
  lng: number,
  radiusInKM = 1
): Photo_Location_Insert[] {
  const records: Photo_Location_Insert[] = [];
  const earthRadiusKm = 6371; // Earth's radius in kilometers

  // Helper function to generate a random point within a radius
  function randomPointInRadius(
    lat: number,
    lng: number,
    radiusKm: number
  ): [number, number] {
    const u = Math.random();
    const v = Math.random();
    const w = radiusKm / earthRadiusKm;
    const t = 2 * Math.PI * v;
    const r = w * Math.sqrt(u);
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);

    const newLat = lat + (y * 180) / Math.PI;
    const newLng =
      lng + (x * 180) / (Math.PI * Math.cos((lat * Math.PI) / 180));
    // return { latitude: newLat, longitude: newLng };
    return [newLat, newLng];
  }

  // Helper function to generate a random timestamp between specified hours and minutes

/**
 * Generates a random timestamp between specified hours and minutes in UTC format
 * 
 * @param fromHour Starting hour (0-23) in local time
 * @param fromMinute Starting minute (0-59) in local time
 * @param toHour Ending hour (0-23) in local time
 * @param toMinute Ending minute (0-59) in local time
 * @param year Optional year (defaults to current year)
 * @param month Optional month (1-12, defaults to current month)
 * @param day Optional day (1-31, defaults to current day)
 * @returns ISO 8601 formatted timestamp string in UTC (Z format)
 */
function randomTimestamp(
  fromHour: number,
  fromMinute: number,
  toHour: number,
  toMinute: number,
  year?: number,
  month?: number,
  day?: number
): string {
  // Get the current date for defaults if not provided
  const now = new Date();
  
  // Use provided values or defaults
  const useYear = year || now.getFullYear();
  const useMonth = month ? month - 1 : now.getMonth(); // JavaScript months are 0-indexed
  const useDay = day || now.getDate();
  
  // Convert hours and minutes to total minutes
  const startMinutes = fromHour * 60 + fromMinute;
  const endMinutes = toHour * 60 + toMinute;

  // Generate random minutes within the range
  const randomTotalMinutes =
    Math.floor(Math.random() * (endMinutes - startMinutes + 1)) +
    startMinutes;

  // Convert back to hours and minutes
  const randomHour = Math.floor(randomTotalMinutes / 60);
  const randomMinute = randomTotalMinutes % 60;
  const randomSecond = Math.floor(Math.random() * 60);

  // Create a date object with the random time in local time
  const localDate = new Date(useYear, useMonth, useDay, randomHour, randomMinute, randomSecond);
  
  // Convert to UTC time
  const utcDate = new Date(localDate.toISOString());
  
  // Return ISO 8601 formatted string with Z suffix indicating UTC
  return utcDate.toISOString();
}




  function randomString(length = 10) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate 100 records
  for (let i = 0; i < count; i++) {
    const randomLocation = randomPointInRadius(lat, lng, radiusInKM); // 1km radius
    const randomDate = randomTimestamp(hourFrom, minuteFrom, hourTo, minuteTo);
    const randomPhotoId = randomString();

    records.push({
      locationTakenAt: randomLocation,
      dateTakenAt: randomDate,
      photoId: randomPhotoId,
    });
  }

  return records;
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 *
 * @param {[number, number]} coord1 - First coordinate as [longitude, latitude]
 * @param {[number, number]} coord2 - Second coordinate as [longitude, latitude]
 * @returns {number} - Distance in meters
 */
export function calculateDistanceInMeters(
  coord1: [number, number],
  coord2: [number, number]
): number {
  // Earth's radius in meters
  const earthRadius = 6371000;

  // Convert degrees to radians
  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

  // Extract coordinates
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  // Calculate differences in coordinates
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate distance
  const distance = earthRadius * c;

  return distance;
}

// Example usage:
// const tbilisiCenter: [number, number] = [44.79855, 41.69672]; // [longitude, latitude]
// const rustaveli: [number, number] = [44.79320, 41.70129];     // [longitude, latitude]
// const distance = calculateDistanceInMeters(tbilisiCenter, rustaveli);
// console.log(`Distance: ${distance.toFixed(2)} meters`);
