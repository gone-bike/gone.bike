import type { APIContext } from 'astro';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path'



// File routes export a get() function, which gets called to generate the file.
// Return an object with `body` to save the file contents in your final build.
// If you export a post() function, you can catch post requests, and respond accordingly
export async function post({ request }: APIContext) {
  const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));
  const targetFolder = path.join(__dirname, '../../../../public/tmp' )
  const formData = await request.formData();

  // @TODO implement file size limit check


  let file = formData.get('file');
  let buf = await file.arrayBuffer();
  let uuid = uuidv4();
  await fs.writeFile(`${targetFolder}/${uuid}.${file.name}`, Buffer.from( new Int8Array(buf) ));
  let upload = {
    upload: uuid,
    lastModified: file.lastModified,
    name: file.name,
    size: file.size,
    type: file.type,
    href: `/tmp/${uuid}.${file.name}`
  };


  return {
    body: JSON.stringify(upload)
  };
}