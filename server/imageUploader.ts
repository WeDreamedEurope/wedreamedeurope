import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import * as fs from "fs";
import * as path from "path";
import mime from "mime-types";
import { NextApiRequest, NextApiResponse } from "next";

// Types
interface ChunkMetadata {
  fileId: string;
  chunkNumber: string;
  totalChunks: string;
  fileName: string;
}

interface UploadResult {
  success: boolean;
  message: string;
}

// S3 Client initialization
export const createS3Client = () => {
  return new S3Client({
    region: "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
    },
  });
};

const sexierParser = async (buffer: Buffer, boundary: string) => {
  console.log(`Sexy Parser!`);
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

// File system operations
const ensureUploadDirectory = (uploadDir: string): void => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
};

const saveChunk = (
  fileData: Buffer,
  metadata: ChunkMetadata,
  uploadDir: string
): string => {
  const chunkPath = path.join(
    uploadDir,
    `${metadata.fileId}-${metadata.chunkNumber}.part`
  );
  fs.writeFileSync(chunkPath, fileData);
  return chunkPath;
};

export const cleanupChunks = (metadata: ChunkMetadata, uploadDir: string): void => {
  for (let i = 0; i < parseInt(metadata.totalChunks); i++) {
    const chunkPath = path.join(uploadDir, `${metadata.fileId}-${i}.part`);
    if (fs.existsSync(chunkPath)) {
      fs.unlinkSync(chunkPath);
    }
  }
};

// R2 upload operation
export const uploadToR2 = async (
  s3Client: S3Client,
  fileBuffer: Buffer,
  fileName: string
): Promise<void> => {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_PUBLIC_BUCKET,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mime.lookup(fileName) || "application/octet-stream",
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("R2 upload error:", error);
    throw new Error(`Failed to upload to R2: ${error}`);
  }
};

// File assembly
const assembleAndUpload = async (
  metadata: ChunkMetadata,
  uploadDir: string,
  s3Client: S3Client
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
    // await uploadToR2(s3Client, completeFile, metadata.fileName);
    console.log(`Assembled And Ready For Upload!`);
    // Clean up after successful upload
    cleanupChunks(metadata, uploadDir);
  } catch (error) {
    cleanupChunks(metadata, uploadDir);
    throw error;
  }
};

// Main handler function
const handleChunkUpload = async (
  fileData: Buffer,
  metadata: ChunkMetadata
): Promise<UploadResult> => {
  const uploadDir = path.join(process.cwd(), "uploads");
  const s3Client = createS3Client();
  console.log(`Handling Chunks Or Something!`);
  try {
    ensureUploadDirectory(uploadDir);
    saveChunk(fileData, metadata, uploadDir);

    // Check if this is the final chunk
    if (parseInt(metadata.chunkNumber) === parseInt(metadata.totalChunks) - 1) {
      await assembleAndUpload(metadata, uploadDir, s3Client);
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

// Request handler (for API route)
const handleUploadRequest = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const chunks: Buffer[] = [];

  return new Promise<void>((resolve, reject) => {
    console.log(`We Are In Process`);
    req.on("data", (chunk: Buffer) => {
      console.log(`Got A Chunk!`);
      chunks.push(chunk);
    });

    req.on("end", async () => {
      console.log(`Read On Data And Shit`);
      try {
        const data = Buffer.concat(chunks);
        const boundary =
          req.headers["content-type"]?.split("; boundary=")[1] || "";
        const { fileData, metadata } = await sexierParser(data, boundary);

        const result = await handleChunkUpload(fileData, metadata);
        console.log(`Handled Chunk Upload!`);
        res.status(200).json(result);
        resolve();
      } catch (error) {
        console.error("Request handling error:", error);
        res.status(500).json({
          success: false,
          message: `Upload failed: ${error}`,
        });
        reject(error);
      }
    });

    req.on("error", (error: Error) => {
      console.error("Request error:", error);
      reject(error);
    });
  });
};

export { handleUploadRequest, handleChunkUpload };
