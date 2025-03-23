import database from "@/db/db";
import { photoLocations } from "@/drizzle/schema";
import { Photo_Location_Insert, Photo_Location_Select } from "../gis_query";
import { sql, eq, and } from "drizzle-orm";

async function insertPhotoLocations(locations: Photo_Location_Insert[]) {
  return await database.insert(photoLocations).values(
    locations.map((location) => ({
      ...location,
      locationTakenAt: sql`ST_SetSRID(ST_MakePoint(${location.locationTakenAt[0]}, ${location.locationTakenAt[1]}), 4326)::point`,
    }))
  );
}

/**
 * Collects and saves photo metadata to the database.
 *
 * This function takes an array of photo metadata objects and sends them to the server
 * to be stored in the PhotoLocation table. Each photo is associated with the user who
 * uploaded it, along with location and timestamp information.
 *
 * @param photoMetaData - Array of photo metadata objects containing:
 *   - userId: The ID of the user who uploaded the photo
 *   - photoId: Unique identifier for the photo
 *   - locationTakenAt: Geographic coordinates where the photo was taken
 *   - dateTakenAt: Timestamp when the photo was taken
 *
 * @returns Promise that resolves to the saved photo location data from the server
 */

const CollectPhotoMetaData = async (
  photoMetaData: Photo_Location_Insert[]
): Promise<Photo_Location_Select[]> => {
  const response = await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(photoMetaData),
  });

  return await response.json();
};

const GetUserPhotosFromDB = async (
  userId: string
): Promise<Photo_Location_Select[]> => {
  const photos = await database
    .select()
    .from(photoLocations)
    .where(
      and(
        eq(photoLocations.userId, userId),
        eq(photoLocations.isDeleted, false)
      )
    );
  return photos;
};

const DeletePhotoFromDB = async (photoRecordId: number, userId: string) => {
  return await database
    .update(photoLocations)
    .set({ isDeleted: true })
    .where(eq(photoLocations.id, photoRecordId))
    .returning();
};

export default {
  insertPhotoLocations,
  CollectPhotoMetaData,
  GetUserPhotosFromDB,
  DeletePhotoFromDB,
};
