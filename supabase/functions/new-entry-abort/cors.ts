const allowedOrigins = [
  'https://trailradar.org',
  'http://localhost'
];
export function getCorsHeaders(req) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = allowedOrigins.includes(origin);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
}
