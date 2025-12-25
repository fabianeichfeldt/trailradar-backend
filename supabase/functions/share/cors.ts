const allowedOrigins = [
  'https://trailradar.org',
];
export function getCorsHeaders(req) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, referrer, Accept-CH, Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform',
    'Accept-CH': 'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };
}
