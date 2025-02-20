import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Buffer } from "buffer";
import * as fs from "fs";
import * as path from "path";
import mime from "mime-types";
import { NextApiRequest, NextApiResponse } from "next";

// Types
export interface ChunkMetadata {
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
  if (!process.env.CLOUDFLARE_ACCESS_KEY_ID) {
    throw new Error('CLOUDFLARE_ACCESS_KEY_ID environment variable is not set');
  }
  if (!process.env.CLOUDFLARE_SECRET_ACCESS_KEY) {
    throw new Error('CLOUDFLARE_SECRET_ACCESS_KEY environment variable is not set');
  }
  if (!process.env.CLOUDFLARE_PUBLIC_BUCKET) {
    throw new Error('CLOUDFLARE_PUBLIC_BUCKET environment variable is not set');
  }
  if (!process.env.S3_ENDPOINT) {
    throw new Error('S3_ENDPOINT environment variable is not set');
  }

  return new S3Client({
    region: "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
      
    },
  });
};

// Multipart form data parser
const parseMultipartFormData = async (buffer: Buffer, boundary: string) => {
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const newLine = Buffer.from("\r\n");
  const doubleNewLine = Buffer.from("\r\n\r\n");

  const parts: Buffer[] = [];
  let currentPosition = 0;

  while (currentPosition < buffer.length) {
    const boundaryPosition = buffer.indexOf(boundaryBuffer, currentPosition);
    if (boundaryPosition === -1) break;

    currentPosition = boundaryPosition + boundaryBuffer.length;

    if (buffer[currentPosition] === newLine[0]) {
      currentPosition += 2;
    }

    const nextBoundaryPosition = buffer.indexOf(boundaryBuffer, currentPosition);
    if (nextBoundaryPosition === -1) break;

    const part = buffer.slice(currentPosition, nextBoundaryPosition - 2);
    parts.push(part);
  }

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

  return { fileData, metadata };
};

// File system operations
const ensureUploadDirectory = (uploadDir: string): void => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const saveChunk = (
  fileData: Buffer,
  metadata: ChunkMetadata,
  uploadDir: string
): string => {
  const chunkPath = path.join(
    uploadDir,
    `${metadata.fileId}_${metadata.chunkNumber}`
  );
  fs.writeFileSync(chunkPath, fileData);
  return chunkPath;
};

const cleanupChunks = (metadata: ChunkMetadata, uploadDir: string): void => {
  for (let i = 1; i <= parseInt(metadata.totalChunks); i++) {
    const chunkPath = path.join(uploadDir, `${metadata.fileId}_${i}`);
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
  console.log(`Init R2 Upload`)
  const contentType = mime.lookup(fileName) || "application/octet-stream";
  
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_PUBLIC_BUCKET!, 
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
};

// File assembly and upload
const assembleAndUpload = async (
  metadata: ChunkMetadata,
  uploadDir: string,
  s3Client: S3Client
): Promise<void> => {
  const chunks: Buffer[] = [];
  const totalChunks = parseInt(metadata.totalChunks);
  
  console.log(`Starting file assembly for ${metadata.fileName} (${totalChunks} chunks)`);
  
  for (let i = 1; i <= totalChunks; i++) {
    const chunkPath = path.join(uploadDir, `${metadata.fileId}_${i}`);
    console.log(`Checking for chunk ${i} at: ${chunkPath}`);
    
    if (!fs.existsSync(chunkPath)) {
      throw new Error(`Missing chunk ${i} at path: ${chunkPath}`);
    }
    
    const chunkData = fs.readFileSync(chunkPath);
    console.log(`Read chunk ${i}: ${chunkData.length} bytes`);
    chunks.push(chunkData);
  }

  const completeFileBuffer = Buffer.concat(chunks);
  console.log(`File assembled successfully. Total size: ${completeFileBuffer.length} bytes`);
  
  console.log(`Starting R2 upload for ${metadata.fileName}`);
  await uploadToR2(s3Client, completeFileBuffer, metadata.fileName);
  
  console.log(`Upload successful, cleaning up temporary chunks...`);
  cleanupChunks(metadata, uploadDir);
  console.log(`Cleanup complete`);
};

// Main handler function
const handleChunkUpload = async (
  fileData: Buffer,
  metadata: ChunkMetadata,
  uploadDir: string
): Promise<UploadResult> => {
  try {
    const currentChunk = parseInt(metadata.chunkNumber);
    const totalChunks = parseInt(metadata.totalChunks);
    
    console.log(`Processing chunk ${currentChunk} of ${totalChunks}`);
    
    ensureUploadDirectory(uploadDir);
    saveChunk(fileData, metadata, uploadDir);

    if (currentChunk === totalChunks) {
      console.log(`Final chunk received (${currentChunk}/${totalChunks}), starting assembly and upload...`);
      const s3Client = createS3Client();
      await assembleAndUpload(metadata, uploadDir, s3Client);
      return { success: true, message: "File uploaded successfully" };
    }

    return { success: true, message: `Chunk ${currentChunk} of ${totalChunks} uploaded successfully` };
  } catch (error) {
    console.error("Error handling chunk upload:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error occurred" };
  }
};

// Request handler (for API route)
export const handleUploadRequest = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const uploadDir = path.join(process.cwd(), "uploads");
    const contentType = req.headers["content-type"] || "";
    const boundary = contentType.split("boundary=")[1];

    if (!boundary) {
      throw new Error("No boundary found in content-type");
    }

    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });

    const buffer = Buffer.concat(chunks);
    const { fileData, metadata } = await parseMultipartFormData(buffer, boundary);
    
    const result = await handleChunkUpload(fileData, metadata, uploadDir);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred" 
    });
  }
};
