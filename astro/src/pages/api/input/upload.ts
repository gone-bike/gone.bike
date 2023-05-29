import type { APIContext } from 'astro';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path'
import sharp from 'sharp'
import config from '@utils/config'

export async function post({ request }: APIContext) {

  // const SECRET_KEY = '';

	// const token = body.get('cf-turnstile-response');
	// const ip = request.headers.get('CF-Connecting-IP');

	// // Validate the token by calling the
	// // "/siteverify" API endpoint.
	// let formData = new FormData();
	// formData.append('secret', SECRET_KEY);
	// formData.append('response', token);
	// formData.append('remoteip', ip);
	// const idempotencyKey = crypto.randomUUID();
	// formData.append('idempotency_key', idempotencyKey);

	// const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
	// const firstResult = await fetch(url, {
	// 	body: formData,
	// 	method: 'POST',
	// });
	// const firstOutcome = await firstResult.json();
	// if (firstOutcome.success) {
	// 	// ...
	// }

	// // A subsequent validation request to the "/siteverify"
	// // API endpoint for the same token as before, providing
	// // the associated idempotency key as well.
	// const subsequentResult = await fetch(url, {
	// 	body: formData,
	// 	method: 'POST',
	// });

	// const subsequentOutcome = await firstResult.json();
	// if (!subsequentOutcome.success) {
  //     return new Response(JSON.stringify({ error: 'captcha failure' }), {
  //       status: 403,
  //       headers: {
  //         "Content-Type": "application/json"
  //       }
  //     });
	// }



  const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf("/"));
  const targetFolder = path.join(__dirname, '../../../../public/tmp' )
  const formData = await request.formData();

  // @TODO implement file size limit check

  try {

    let file: any = formData.get('file');
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
      return new Response(JSON.stringify({ error: err?.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
  }
}