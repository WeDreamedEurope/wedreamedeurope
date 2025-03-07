import { Photo_Location_Insert } from "@/server/gis_query";

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
  function randomTimestamp(
    fromHour: number,
    fromMinute: number,
    toHour: number,
    toMinute: number
  ) {
    const startMinutes = fromHour * 60 + fromMinute;
    const endMinutes = toHour * 60 + toMinute;

    const randomTotalMinutes =
      Math.floor(Math.random() * (endMinutes - startMinutes + 1)) +
      startMinutes;

    const randomHour = Math.floor(randomTotalMinutes / 60);
    const randomMinute = randomTotalMinutes % 60;
    const randomSecond = Math.floor(Math.random() * 60);

    const date = new Date(2024, 1, 18, randomHour, randomMinute, randomSecond);
    return date.toISOString(); // ISO 8601 format with timezone
  }

  // Helper function to generate a random string
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
