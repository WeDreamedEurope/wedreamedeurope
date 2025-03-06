import database from "@/db/db";
import { photoLocations } from "@/drizzle/schema";
import { Photo_Location_Insert } from "./gis_query";

 const saveUserPhotoMetaData = async (
  photoMetaData: Photo_Location_Insert[]
) => {
  const metaData = await database
    .insert(photoLocations)
    .values(photoMetaData)
    .returning();
  return metaData;
};



export const CollectPhotoMetaData = async (photoMetaData: Photo_Location_Insert[]) => {
 
  
console.log(photoMetaData)
  const response = await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(photoMetaData),
  });

  return await response.json();


};
