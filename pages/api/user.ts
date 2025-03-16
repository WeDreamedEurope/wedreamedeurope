import {
  insertPhotoLocations,
  Photo_Location_Insert,
} from "@/API_CALLS/gis_query";
import { GetUserPhotosFromDB } from "@/API_CALLS/user/user.server";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

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

        if (photoLocationsFromPayload.length === 0) {
          res.status(200).json({ message: "No photos to save" });
          return;
        }
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

  if (method === "GET") {
    await getUserPhotos(req, res);
  }
}

const getUserPhotos = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
  }

  const photos = await GetUserPhotosFromDB(session?.user.id as string);
  res.status(200).json(photos);
};
