import { NextApiResponse } from "next";
import { getAllPhotos } from "@/API_CALLS/gis_query";
import { NextApiRequest } from "next";





export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    
    const photos = await getAllPhotos();
    return res.status(200).json(photos);
  }
}

