import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
});

const UPLOAD_LOCATION = path.join(process.cwd(), "uploads");
interface ChunkMetadata {
  fileId: string;
  chunkNumber: string;
  totalChunks: string;
  fileName: string;
}

interface CloudflareImagesUploadResponse {
  success: boolean;
  result: {
    id: string;
    filename: string;
    uploaded: string;
    requireSignedURLs: boolean;
    variants: string[];
  };
  errors: string[];
  messages: string[];
}

/**
 * Parses the multipart form data to extract file data and metadata.
 */

const sexierParser = async (buffer: Buffer, boundary: string) => {
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const newLine = Buffer.from("\r\n");
  const doubleNewLine = Buffer.from("\r\n\r\n");

  // Find all boundary positions
  const parts: Buffer[] = [];
  let currentPosition = 0;

  while (currentPosition < buffer.length) {
    // Find next boundary
    const boundaryPosition = buffer.indexOf(boundaryBuffer, currentPosition);
    if (boundaryPosition === -1) break;

    // Move position to after boundary
    currentPosition = boundaryPosition + boundaryBuffer.length;

    // Skip the newline after boundary
    if (buffer[currentPosition] === newLine[0]) {
      currentPosition += 2;
    }

    // Find the next boundary
    const nextBoundaryPosition = buffer.indexOf(
      boundaryBuffer,
      currentPosition
    );
    if (nextBoundaryPosition === -1) break;

    // Extract the part (excluding final newline before next boundary)
    const part = buffer.slice(currentPosition, nextBoundaryPosition - 2);
    parts.push(part);
  }

  // Process parts to extract metadata and file
  const metadata: ChunkMetadata = {
    fileId: "",
    chunkNumber: "",
    totalChunks: "",
    fileName: "",
  };

  let fileData: Buffer = Buffer.alloc(0);

  for (const part of parts) {
    const headerEndIndex = part.indexOf(doubleNewLine);
    if (headerEndIndex === -1) continue;

    const header = part.slice(0, headerEndIndex).toString("utf8");
    const content = part.slice(headerEndIndex + 4);

    if (header.includes('name="file"')) {
      fileData = content;
    } else if (header.includes('name="fileId"')) {
      metadata.fileId = content.toString().trim();
    } else if (header.includes('name="chunkNumber"')) {
      metadata.chunkNumber = content.toString().trim();
    } else if (header.includes('name="totalChunks"')) {
      metadata.totalChunks = content.toString().trim();
    } else if (header.includes('name="fileName"')) {
      metadata.fileName = content.toString().trim();
    }
  }

  console.log(metadata);
  return { fileData, metadata };
};
function extractHeaderValue(headers: string, name: string): string | null {
  const regex = new RegExp(
    `name="${name}".*?\\r\\n\\r\\n(.*?)(?:\\r\\n|$)`,
    "s"
  );
  const match = headers.match(regex);
  return match ? match[1].trim() : null;
}
const parseFormData = (
  body: string,
  boundary: string
): { fileData: string; metadata: ChunkMetadata } => {
  const parts = body.split(`--${boundary}`);
  // console.log("First part content:", parts[1]);
  const fileData = parts[1].split("\r\n\r\n")[1];
  const fileId = parts[1].match(/name="fileId"\r\n\r\n(.*)\r\n/)?.[1] || "";
  const chunkNumber =
    parts[1].match(/name="chunkNumber"\r\n\r\n(.*)\r\n/)?.[1] || "";
  const totalChunks =
    parts[1].match(/name="totalChunks"\r\n\r\n(.*)\r\n/)?.[1] || "";
  const fileName = parts[1].match(/name="fileName"\r\n\r\n(.*)\r\n/)?.[1] || "";

  return {
    fileData,
    metadata: {
      fileId,
      chunkNumber,
      totalChunks,
      fileName,
    },
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const chunks: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        req.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        req.on("end", async () => {
          try {
            const data = Buffer.concat(chunks);
            const boundary =
              req.headers["content-type"]?.split("; boundary=")[1] || "";

            // const body = data.toString();
            const { fileData, metadata } = await sexierParser(data, boundary);
            const result = await handleChunkProcessing(fileData, metadata);

            console.log(`This Is Final Step!`);
            res.status(200).json(`We Managed It!`);
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        req.on("error", (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error("Error processing upload:", error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

const handleChunkProcessing = async (
  fileData: Buffer,
  metadata: ChunkMetadata
) => {
  const uploadDir = path.join(process.cwd(), UPLOAD_LOCATION);
  // const s3Client = createS3Client();
  console.log(`Handling Chunks Or Something!`);
  try {
    ensureUploadDirectory(uploadDir);
    saveChunk(fileData, metadata, uploadDir);

    // Check if this is the final chunk
    if (parseInt(metadata.chunkNumber) === parseInt(metadata.totalChunks) - 1) {
      // await assembleAndUpload(metadata, uploadDir, s3Client);
      return {
        success: true,
        message: "File assembled and uploaded to R2 successfully",
      };
    }

    return {
      success: true,
      message: `Chunk ${metadata.chunkNumber} received successfully`,
    };
  } catch (error) {
    console.error("Upload handling error:", error);
    throw new Error(`Failed to process upload: ${error}`);
  }
};

const ensureUploadDirectory = (uploadDir: string): void => {
  if (!fs.existsSync(UPLOAD_LOCATION)) {
    console.log(`Upload Location Doesnt Exist`);
    fs.mkdirSync(UPLOAD_LOCATION, { recursive: true });
  }
  // if (!fs.existsSync(uploadDir)) {
  //   fs.mkdirSync(uploadDir);
  // }
};

const saveChunk = (
  fileData: Buffer,
  metadata: ChunkMetadata,
  uploadDir: string
): string => {
  const chunkPath = path.join(
    UPLOAD_LOCATION,
    `${metadata.fileId}-${metadata.chunkNumber}.part`
  );
  fs.writeFileSync(chunkPath, fileData);
  return chunkPath;
};
