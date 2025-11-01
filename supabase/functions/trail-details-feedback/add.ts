import 'npm:tslib@2';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { getCorsHeaders } from './cors.ts';

export async function addFeedback(req) {
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
  console.log(payload);
  if (!payload.trail_id || payload.up === undefined ) {
    return new Response(JSON.stringify({
      error: 'Missing payload values, either trail_id or up'
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
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
    global: {
      headers: {
        Authorization: req.headers.get('Authorization')
      }
    }
  });
  const { data, error } = await supabase.from('trail_details_feedback').insert({
    trail_id: payload.trail_id,
    up: payload.up,
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
}
