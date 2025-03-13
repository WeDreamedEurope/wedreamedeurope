import { handleUploadRequest } from "@/API_CALLS/imageUploader";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const serverSession = await getServerSession(req, res, authOptions);
    console.log(serverSession?.user);
    await handleUploadRequest(req, res);
  }
}
