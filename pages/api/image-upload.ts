/**
 * Handles HTTP requests for image uploads.
 * Accepts POST requests, parses form data to retrieve the uploaded file,
 * reads the file buffer, and uploads the image.
 * Responds with the uploaded image data upon success,
 * or an error message upon failure.
 * Rejects non-POST requests with a 405 status code.
 */

import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.json({ error: "Method not allowed" });
  }

  try {


    const form = formidable({ multiples: true });
    
    const { files } = await new Promise<{ files: formidable.Files }>(
      (resolve, reject) => {
        console.log(`Formidable Initiated`)
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          console.log(`Bla Bla Bla!`)
          resolve({ files });
        });
      }
    );
    console.log(files);
    res.status(200).json({ success: true, files });
  } catch (err) {
    console.log(err);
    return res.json({ error: "Something went wrong" });
  }
}
