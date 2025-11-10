// CloudFlare Pages Functions - Middleware
// این فایل برای CloudFlare Pages Functions است

export async function onRequest(context) {
  const { request, next } = context;
  
  // Get response
  const response = await next();
  
  // Add custom headers
  const newHeaders = new Headers(response.headers);
  
  // Security Headers
  newHeaders.set('X-Powered-By', 'CloudFlare Pages');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-Frame-Options', 'DENY');
  newHeaders.set('X-XSS-Protection', '1; mode=block');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS (if needed)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  // Return modified response
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
