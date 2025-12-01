import 'npm:tslib@2';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { getCorsHeaders } from './cors.ts';

export async function getDetails(req) {
  const url = new URL(req.url);
    const trail = url.searchParams.get("trail");
    console.log(trail);
    if (!trail) {
      return new Response(JSON.stringify({
        error: 'Missing payload value trail'
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
      .from('trail_details')
      .select(`
        *,
        trails (
          name,
          creator,
          instagram
        )
      `)
      .eq('trail_id', trail)
      .single();

    console.log(data);
    await supabase.from('trail_clicks').insert({
      trail_id: trail
    });
    if (error) {
      throw error;
    }

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
