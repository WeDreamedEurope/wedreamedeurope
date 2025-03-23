import { NextApiResponse } from "next";
import {
  getAllPhotos,
  Photo_Location_Select_With_URL,
} from "@/API_CALLS/gis_query";
import { NextApiRequest } from "next";
import { urlBuilder } from "@/lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const photos = await getAllPhotos();
    const photosWithUrl = photos.map<Photo_Location_Select_With_URL>(
      (photo) => ({
        ...photo,
        distance: 0,
        url: urlBuilder(photo.photoId, photo.userId),
      })
    );
    return res.status(200).json(photosWithUrl);
  }
}
