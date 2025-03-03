import {
  getPhotosInRadius,
  insertPhotoLocations
} from "@/server/gis_query";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return await postData(req, res);
  } else if (req.method === "GET") {
    const { center, radius } = req.query;

    if (isNaN(Number(radius))) {
      return res.status(400).json({ message: `Invalid radius` });
    }

    if (!center || typeof center !== 'string') {
      return res.status(400).json({ message: 'Invalid center coordinates' });
    }

    try {
      const centerCoords = JSON.parse(center) as [number, number];
      if (!Array.isArray(centerCoords) || centerCoords.length !== 2 || 
          !centerCoords.every(coord => typeof coord === 'number')) {
        return res.status(400).json({ message: 'Invalid center coordinates format' });
      }

      const photosInRadius = await pointsInRadius(centerCoords, Number(radius));
      return res.status(200).json(photosInRadius);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'Invalid JSON in center parameter' });
    }
  }
}

const postData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { body } = req;
    await insertPhotoLocations(JSON.parse(body));
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

const pointsInRadius = async (center: [number, number], radius: number) => {
  return await getPhotosInRadius(center, radius);
};
