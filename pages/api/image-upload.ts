import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser
  },
};

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

  const fileIdMatch = parts[1].match(
    /Content-Disposition:[^\n]*name="fileId"[^\n]*\r\n\r\n([\s\S]*?)(?:\r\n|$)/i
  );
  const chunkNumberMatch = parts[1].match(
    /name="chunkNumber"\r\n\r\n([\s\S]*?)\r\n/
  );

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

/**
 * Uploads an assembled file to Cloudflare Images.
 */
async function uploadToCloudflareImages(
  filePath: string,
  apiToken: string,
  accountId: string
): Promise<CloudflareImagesUploadResponse> {
  const fileData = fs.readFileSync(filePath);

  const formData = new FormData();
  formData.append("file", new Blob([fileData]), path.basename(filePath));

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data: CloudflareImagesUploadResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading to Cloudflare Images:", error);
    throw error;
  }
}

/**
 * Handles chunked file uploads and assembles the final file.
 */
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

            const uploadDir = path.join(process.cwd(), "uploads");
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir);
            }

            // Save the chunk as a readable file
            const chunkFilePath = path.join(
              uploadDir,
              `${metadata.fileId}-${metadata.chunkNumber}.part`
            );
            fs.writeFileSync(chunkFilePath, fileData);
            // console.log(metadata);
            if (
              parseInt(metadata.chunkNumber) ===
              parseInt(metadata.totalChunks) - 1
            ) {
              // All chunks have been uploaded, now combine them
              const finalFilePath = path.join(uploadDir, metadata.fileName);
              const writeStream = fs.createWriteStream(finalFilePath);

              for (let i = 0; i < parseInt(metadata.totalChunks); i++) {
                const chunkFilePath = path.join(
                  uploadDir,
                  `${metadata.fileId}-${i}.part`
                );
                const chunkData = fs.readFileSync(chunkFilePath);
                writeStream.write(chunkData);
                fs.unlinkSync(chunkFilePath); // Delete the chunk file after combining
              }

              writeStream.end();

              // const apiToken = process.env.CLOUDFLARE_API_TOKEN;
              // const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

              // if (!apiToken || !accountId) {
              //   throw new Error('Missing Cloudflare API token or account ID');
              // }

              // const uploadResponse = await uploadToCloudflareImages(finalFilePath, apiToken, accountId);
              // console.log('Upload to Cloudflare Images successful:', uploadResponse);

              // fs.unlinkSync(finalFilePath);

              console.log(
                `WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE`
              );
              res
                .status(200)
                .json({ message: "File uploaded and processed successfully" });
            } else {
              res.status(200).json({ message: "Chunk uploaded successfully" });
            }

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
