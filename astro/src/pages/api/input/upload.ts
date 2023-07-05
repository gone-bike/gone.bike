import type { APIContext } from "astro";
import { v4 as uuidv4 } from "uuid";
// import fs from 'fs/promises';
import path from "path";
import sharp from "sharp";
import config from "@utils/config";

export async function post({ request }: APIContext) {
  // @TODO implement file size limit check and define quality, tmp folder via config
  const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));

  const targetFolder =
    config.TMP_FOLDER_IMAGE || path.join(__dirname, "../../../../public/tmp/");
  //
  console.log("targetFolder: ", targetFolder);

  const formData = await request.formData();

  try {
    let file: File = formData.get("file");
    let buf = await file.arrayBuffer();
    let uuid = uuidv4();

    const filename = `${uuid}.${file.name}`;
    /*  const filename = uuid + '.' + file.name; */
    const filepath = `${targetFolder}${filename}`;
    /* const filepath = targetFolder + '\' + uuid + '.' + file.name;
    console.log("filepath: ", filepath); */

    let output = await sharp(buf)
      .resize(config.IMG_MAX_W, config.IMG_MAX_H, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFormat("jpeg", { quality: 100 })
      .toFile(filepath);

    let upload = {
      upload: uuid,
      lastModified: file.lastModified,
      name: file.name,
      size: output.size,
      type: output.format,
      width: output.width,
      height: output.height,
      href: `/tmp/${filename}`
    };
    /* return {
      body: JSON.stringify({
        everything: "ok"
      })
    }; */

    return {
      body: JSON.stringify(upload)
    };
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
