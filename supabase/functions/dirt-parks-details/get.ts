import 'npm:tslib@2';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { getCorsHeaders } from './cors.ts';

export async function getDetails(req) {
  const url = new URL(req.url);
    const id = url.searchParams.get("id");
    console.log(id);
    if (!id) {
      return new Response(JSON.stringify({
        error: 'Missing payload value id'
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

    const { data, error } = await supabase
    .from('dirt_park_details')
    .select('*')
    .eq('id', id)
    .single();

    await supabase.from('dirtpark_clicks').insert({
      dirtpark_id: id
    });
    if (error) {
      throw error;
    }
    data.photos = [];
    data.videos = [];
    return new Response(JSON.stringify({
      data
    }), {
      status: 200,
      headers: {
        ...getCorsHeaders(req),
        'Content-Type': 'application/json'
      }
    });
}
