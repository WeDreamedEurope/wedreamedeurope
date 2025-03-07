import database from "@/db/db";
import { photoLocations } from "@/drizzle/schema";
import { Photo_Location_Insert } from "./gis_query";
import { sql } from "drizzle-orm";


export async function insertPhotoLocations(locations: Photo_Location_Insert[]) {
  return await database.insert(photoLocations).values(
    locations.map((location) => ({
      ...location,
      locationTakenAt: sql`ST_SetSRID(ST_MakePoint(${location.locationTakenAt[0]}, ${location.locationTakenAt[1]}), 4326)::point`,
    }))
  );
}



export const CollectPhotoMetaData = async (photoMetaData: Photo_Location_Insert[]) => {
 

  const response = await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(photoMetaData),
  });

  return await response.json();


};
