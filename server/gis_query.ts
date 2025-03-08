import database from "@/db/db";
import { photoLocations } from "@/drizzle/schema";
import { addMinutes, subMinutes } from "date-fns";
import { sql } from "drizzle-orm";

export type Photo_Location_Client = typeof photoLocations.$inferSelect & {
  distance: number;
};
export type Photo_Location_Select = typeof photoLocations.$inferSelect;
export type Photo_Location_Insert = typeof photoLocations.$inferInsert;
export type Photo_Query = Pick<
  Photo_Location_Select,
  "dateTakenAt" | "locationTakenAt"
> & { radius: number };
export const InsertGeoInformation = async (
  photoInfo: Photo_Location_Insert[]
) => {
  if (photoInfo.length === 0) return;
};

export async function insertPhotoLocations(locations: Photo_Location_Insert[]) {
  return await database
    .insert(photoLocations)
    .values(
      locations.map((location) => ({
        ...location,
        locationTakenAt: sql`ST_SetSRID(ST_MakePoint(${location.locationTakenAt[0]}, ${location.locationTakenAt[1]}), 4326)::point`,
      }))
    )
    .returning();
}

export async function getPhotosInRadius(
  coordinates: [number, number],
  radiusInMeters: number
): Promise<Photo_Location_Select[]> {
  return await database
    .select()
    .from(photoLocations)
    .where(
      sql`ST_DWithin(
        ${sql`ST_SetSRID(ST_MakePoint(${coordinates[0]}, ${coordinates[1]}), 4326)::geography`},
        ST_SetSRID(location_taken_at::geometry, 4326)::geography,
        ${radiusInMeters}
      )`
    );
}

export async function getPhotosInRadiusAndTimeRange(
  coordinates: [number, number],
  radiusInMeters: number,
  referenceTime: Date,
  minutesRange: number
): Promise<Photo_Location_Select[]> {
  const timeRangeInMinutes = minutesRange;
  const startTime = new Date(
    referenceTime.getTime() - timeRangeInMinutes * 60000
  );
  const endTime = new Date(
    referenceTime.getTime() + timeRangeInMinutes * 60000
  );

  return await database
    .select()
    .from(photoLocations)
    .where(
      sql`ST_DWithin(
        ${sql`ST_SetSRID(ST_MakePoint(${coordinates[0]}, ${coordinates[1]}), 4326)::geography`},
        ST_SetSRID(location_taken_at::geometry, 4326)::geography,
        ${radiusInMeters}
      )
      AND date_taken_at >= ${startTime}
      AND date_taken_at <= ${endTime}`
    );
}
export async function getPhotosInRadiusAndTimeRangeRedux(
  coordinates: [number, number],
  radiusInMeters: number,
  referenceTime: Date,
  minutesRange: number
): Promise<Photo_Location_Select[]> {
  const timeRangeInMinutes = minutesRange;
  const startTime = subMinutes(referenceTime, timeRangeInMinutes);
  const endTime = addMinutes(referenceTime, timeRangeInMinutes);

  return await database
    .select()
    .from(photoLocations)
    .where(
      sql`
      ST_DWithin(
        ${sql`ST_SetSRID(ST_MakePoint(${coordinates[0]}, ${coordinates[1]}), 4326)::geography`},
        ST_SetSRID(location_taken_at::geometry, 4326)::geography,
        ${radiusInMeters}
      ) AND
      date_taken_at BETWEEN ${startTime} AND ${endTime}
    `
    );
}

export async function getAllPhotos() {
  return await database.select().from(photoLocations);
}

export async function getAllPhotosClient(): Promise<Photo_Location_Client[]> {
  const photos = await fetch("/api/photolibrary", { method: "GET" });
  return photos.json();
}

export async function getPhotosInRadiusAndTimeRangeClient(
  arg: Photo_Query
): Promise<Photo_Location_Client[]> {
  const photos = await fetch("/api/photolibrary", {
    method: "POST",
    body: JSON.stringify(arg),
  });
  return photos.json();
}
