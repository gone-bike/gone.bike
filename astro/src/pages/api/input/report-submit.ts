import { v4 as uuidv4 } from 'uuid'
import celery from '@utils/celery'
import config from '@utils/config'

export async function post({params, request}) {

  let id = uuidv4(), ts = new Date().getTime();
  let data = await request.json();

  // const SECRET_KEY = '';


  const token = data['cf_turnstile_response']
  const ip = request.headers.get('CF-Connecting-IP');

  // // Validate the token by calling the
  // // "/siteverify" API endpoint.
  let formData = new FormData();
  formData.append('secret', config.CLOUDFLARE_CAPTCHA_SECRET);
  formData.append('response', token);
  formData.append('remoteip', ip);
  // const idempotencyKey = crypto.randomUUID();
  // formData.append('idempotency_key', idempotencyKey);

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const firstResult = await fetch(url, {
    body: formData,
    method: 'POST',
  });
  const firstOutcome = await firstResult.json();
  if (!firstOutcome.success) {
    return new Response(JSON.stringify({ error: firstOutcome }), {
      status: 403,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  // // A subsequent validation request to the "/siteverify"
  // // API endpoint for the same token as before, providing
  // // the associated idempotency key as well.
  // const subsequentResult = await fetch(url, {
  //  body: formData,
  //  method: 'POST',
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


  let result = await celery(id, 'tasks.report_submit', [ id, ts ], data)

  return {
    body: JSON.stringify({
      result: result
    }),
  };
}
