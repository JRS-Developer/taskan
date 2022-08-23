import { env } from "@/env/server.mjs";
import { createClient } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import { type Fields, type Files, IncomingForm, File } from "formidable";
import { promises as fs } from "fs";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

const getFileExtension = (filename: string) =>
  filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
  filename;

const uploadImage = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // get Image from the request, req.body doesn't work
    const data = await new Promise<{ fields: Fields; files: Files }>(
      (resolve, reject) => {
        const form = new IncomingForm();

        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      }
    );

    let imageTmp: File | undefined;

    if (Array.isArray(data.files.image)) {
      imageTmp = data.files.image[0];
    } else {
      imageTmp = data.files.image;
    }

    // check that the image is in the body
    if (!imageTmp)
      return res.status(500).json({ message: "No image provided" });

    const ext =
      imageTmp?.originalFilename &&
      getFileExtension(imageTmp?.originalFilename);

    // read file from the temporary path
    const image = await fs.readFile(imageTmp.filepath);

    // get the filename with file extension
    const filename = `${imageTmp.newFilename}.${ext}`;
    const saveFilePath = `public/${filename}`;

    const storage = supabase.storage.from(env.SUPABASE_BUCKET);

    // upload image
    const { error } = await storage.upload(saveFilePath, image, {
      contentType: imageTmp.mimetype || "",
    });

    if (error) throw error;

    // get public image url
    const { publicURL, error: errorPublicUrl } =
      storage.getPublicUrl(saveFilePath);

    if (errorPublicUrl) throw error;

    return res.status(200).json({
      url: publicURL,
    });
  } catch (e) {
    console.log("error: ", e);
    return res.status(500).json({
      error: e,
    });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") return await uploadImage(req, res);
  else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
