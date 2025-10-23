import 'npm:tslib@2';
import { addTrail } from './add.ts';
import { getTrails } from './get.ts';
import { getCorsHeaders } from './cors.ts';
console.info('server started');
Deno.serve(async (req)=>{
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: getCorsHeaders(req)
      });
    }
    if (req.method === 'POST') return await addTrail(req);
    else if (req.method === 'GET') return await getTrails(req);
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
