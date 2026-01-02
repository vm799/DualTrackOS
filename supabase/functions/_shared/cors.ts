// Shared CORS headers for Edge Functions

// Whitelist of allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://dualtrack.app',
  'https://www.dualtrack.app',
  'https://dualtrack.vercel.app',
  'https://dualtrack-os.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

// Dynamic CORS headers based on request origin
export function getCorsHeaders(origin: string | null): Record<string, string> {
  // Check if origin is in whitelist
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]; // Default to production domain

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Legacy export for backwards compatibility
export const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.get('origin');
    return new Response('ok', { headers: getCorsHeaders(origin) });
  }
  return null;
}
