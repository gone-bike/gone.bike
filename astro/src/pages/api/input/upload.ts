import type { APIContext } from 'astro';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path'
import sharp from 'sharp'
import config from '@utils/config'

// File routes export a get() function, which gets called to generate the file.
// Return an object with `body` to save the file contents in your final build.
// If you export a post() function, you can catch post requests, and respond accordingly
export async function post({ request }: APIContext) {
  const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));
  const targetFolder = path.join(__dirname, '../../../../public/tmp' )
  const formData = await request.formData();

  // @TODO implement file size limit check

  try {

    let file = formData.get('file') as File;
    let buf = await file.arrayBuffer();
    let uuid = uuidv4();

    let output = await sharp(buf)
      .resize(config.IMG_MAX_W, config.IMG_MAX_H, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFormat('jpeg', { "quality": 100 })
      .toFile(`${targetFolder}/${uuid}.${file.name}`)

    let upload = {
      upload: uuid,
      lastModified: file.lastModified,
      name: file.name,
      size: output.size,
      type: output.format,
      width: output.width,
      height: output.height,
      href: `/tmp/${uuid}.${file.name}`
    };

    return {
      body: JSON.stringify(upload)
    };
  } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
  }
}