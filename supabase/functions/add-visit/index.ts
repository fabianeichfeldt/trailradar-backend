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
    const mobile_strin = req.headers.get('sec-ch-ua-mobile');
    console.log('Is mobile: ', mobile_strin);
    const mobile = mobile_strin === '?1';
    const platform = req.headers.get('sec-ch-ua-platform'); // e.g. "Android", "iOS", "Windows"
    const agent = req.headers.get('sec-ch-ua') ?? req.headers.get('user-agent');
    /*if (!agent) {
      return new Response(JSON.stringify({
        error: 'Missing or empty "user-agent" header'
      }), {
        status: 400,
        headers: {
          ...getCorsHeaders(req),
          'Content-Type': 'application/json'
        }
      });
    }*/ const supabaseUrl = Deno.env.get('SUPABASE_URL');
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
    const { data, error } = await supabase.from('visits').insert({
      user_agent: agent,
      mobile: mobile,
      platform: platform
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
      status: 200
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
