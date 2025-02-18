import { Photo_Location_Insert } from "@/server/gis_query";

export function generateRandomData(): Photo_Location_Insert[] {
  const records: Photo_Location_Insert[] = [];
  const centerLat = 44.762327177662875;
  const centerLng = 41.71848662012972;
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

  // Helper function to generate a random timestamp between 19:00 and 21:00
  function randomTimestamp() {
    const startHour = 19;
    const endHour = 21;
    const randomHour =
      Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
    const randomMinute = Math.floor(Math.random() * 60);
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
  for (let i = 0; i < 100; i++) {
    const randomLocation = randomPointInRadius(centerLat, centerLng, 1); // 1km radius
    const randomDate = randomTimestamp();
    const randomPhotoId = randomString();

    records.push({
      locationTakenAt: randomLocation,
      dateTakenAt: randomDate,
      photoId: randomPhotoId,
    });
  }

  return records;
}

// Generate and log the data
// const randomData = generateRandomData();
// console.log(JSON.stringify(randomData, null, 2));
