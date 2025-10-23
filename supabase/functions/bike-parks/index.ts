import 'npm:tslib@2';
import { addPark } from './add.ts';
import { getParks } from './get.ts';
import { getCorsHeaders } from './cors.ts';
console.info('server started');
Deno.serve(async (req)=>{
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: getCorsHeaders(req)
      });
    }
    if (req.method === 'POST') return await addPark(req);
    else if (req.method === 'GET') return await getParks(req);
    else {
      return new Response(JSON.stringify({
        error: 'Method not allowed'
      }), {
        status: 405,
        headers: {
          ...getCorsHeaders(req),
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({
      error: err?.message ?? String(err)
    }), {
      status: 500,
      headers: {
        ...getCorsHeaders(req),
        'Content-Type': 'application/json'
      }
    });
  }
});
