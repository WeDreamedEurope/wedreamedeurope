import database from "@/db/db";
import { photoLocations } from "@/drizzle/schema";
import { Photo_Location_Insert } from "@/server/gis_query";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    try {
      const payload = JSON.parse(req.body);

      if (Array.isArray(payload)) {
        const photoLocationsFromPayload = payload.map<Photo_Location_Insert>(
          (photo: Photo_Location_Insert) => ({
            userId: photo.userId as string,
            photoId: photo.photoId,
            locationTakenAt: photo.locationTakenAt,
            dateTakenAt: photo.dateTakenAt,
          })
        );
        const savedPhotoLocations = await database
          .insert(photoLocations)
          .values(photoLocationsFromPayload)
          .returning();

        res.status(200).json(savedPhotoLocations);
      } else {
        res.status(500).json({ message: "Photo location not saved" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving photo location" });
    }
  }
}
