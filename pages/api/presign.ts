import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileName, fileType, userID } = JSON.parse(req.body);

  if (fileName && fileName && userID) {
    try {
      const presignedUrl = await generateSignedUrl(
        `${userID}/${fileName}`,
        fileType
      );
      res.status(200).json(presignedUrl);
    } catch (error) {
      console.error(error);
      
      res.status(500).json({ error: "Failed to generate presigned URL" });
    }
  }
}

const generateSignedUrl = async (fileName: string, fileType: string) => {
  const client = createS3Client();
  const command = CreatePutCommand(
    process.env.CLOUDFLARE_PUBLIC_BUCKET!,
    fileName,
    fileType
  );
  return await getSignedUrl(client, command, {});
};

const createS3Client = () => {
  return new S3Client({
    region: "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
    },
  });
};

const CreatePutCommand = (bucket: string, key: string, contentType: string) => {
  return new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
};
