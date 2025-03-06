import {
  insertPhotoLocations,
  Photo_Location_Insert,
} from "@/server/gis_query";
import { NextApiRequest, NextApiResponse } from "next";

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
        
        const savedPhotoLocations = await insertPhotoLocations(
          photoLocationsFromPayload
        );

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
