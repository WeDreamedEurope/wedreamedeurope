import { handleUploadRequest } from "@/server/imageUploader";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await handleUploadRequest(req, res);
}