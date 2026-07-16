import { createClient } from 'npm:@supabase/supabase-js@2';
import { getCorsHeaders } from './cors.ts';

Deno.serve(async (req)=>{
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: getCorsHeaders(req)
      });
    }
    if (req.method !== 'POST') {
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
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(JSON.stringify({
        error: 'Expected application/json'
      }), {
        status: 400,
        headers: {
          ...getCorsHeaders(req),
          'Content-Type': 'application/json'
        }
      });
    }
    const payload = await req.json();
    if (!payload.trail_id || !payload.message) {
      return new Response(JSON.stringify({
        error: 'Missing payload values, either trail_id or message'
      }), {
        status: 400,
        headers: {
          ...getCorsHeaders(req),
          'Content-Type': 'application/json'
        }
      });
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({
        error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
      }), {
        status: 500,
        headers: {
          ...getCorsHeaders(req),
          'Content-Type': 'application/json'
        }
      });
    }
    const supabase = createClient(supabaseUrl, serviceKey, {  });
    const { data, error } = await supabase.from('reports').insert({
      trail_id: payload.trail_id,
      message: payload.message,
      user_id: payload.user_id ?? null
    });
    if (error) {
      throw error;
    }
    return new Response(JSON.stringify({
      data
    }), {
      headers: {
        ...getCorsHeaders(req),
        'Content-Type': 'application/json'
      },
      status: 201
    });
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
