import { v4 as uuidv4 } from 'uuid'
import celery from '@utils/celery'

export async function post({params, request}) {

  let id = uuidv4(), ts = new Date().getTime();
  let data = await request.json();

  let result = await celery(id, 'tasks.report_submit', [ id, ts ], data)

  return {
    body: JSON.stringify({
      result: result
    }),
  };
}
