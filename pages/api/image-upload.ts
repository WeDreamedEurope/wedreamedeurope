import { createS3Client, uploadToR2 } from "@/server/imageUploader";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

const UPLOAD_LOCATION = path.join(process.cwd(), "uploads");
interface ChunkMetadata {
  fileId: string;
  chunkNumber: string;
  totalChunks: string;
  fileName: string;
}

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
            await handleChunkProcessing(fileData, metadata);

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
  // const s3Client = createS3Client();
  console.log(`Handling Chunks Or Something!`);
  try {
    ensureUploadDirectory(UPLOAD_LOCATION);
    saveChunk(fileData, metadata, UPLOAD_LOCATION);

    // Check if this is the final chunk
    if (parseInt(metadata.chunkNumber) === parseInt(metadata.totalChunks) - 1) {
      console.log(`Assembling File`);
      await assembleAndUpload(metadata, UPLOAD_LOCATION);
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

const assembleAndUpload = async (
  metadata: ChunkMetadata,
  uploadDir: string
): Promise<void> => {
  const chunks: Buffer[] = [];
  let totalSize = 0;

  try {
    // Read all chunks
    for (let i = 0; i < parseInt(metadata.totalChunks); i++) {
      const chunkPath = path.join(uploadDir, `${metadata.fileId}-${i}.part`);
      const chunkData = fs.readFileSync(chunkPath);
      totalSize += chunkData.length;
      chunks.push(chunkData);
    }

    // Combine chunks and upload
    const completeFile = Buffer.concat(chunks, totalSize);
    const s3Client = createS3Client();
    console.log(`Assembled And Ready For Upload!`);
    await uploadToR2(s3Client, completeFile, metadata.fileName);
    // Clean up after successful upload
    console.log(`File Upload`);
    cleanupChunks(metadata);
    console.log(`Should Clean Up`);
  } catch (error) {
    console.log(`Should Clean Up`);
    // cleanupChunks(metadata, uploadDir);
    throw error;
  }
};

const cleanupChunks = (metadata: ChunkMetadata): void => {
  for (let i = 0; i < parseInt(metadata.totalChunks); i++) {
    const chunkPath = path.join(
      UPLOAD_LOCATION,
      `${metadata.fileId}-${i}.part`
    );
    if (fs.existsSync(chunkPath)) {
      fs.unlinkSync(chunkPath);
    }
  }
};
