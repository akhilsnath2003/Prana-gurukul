import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './lib/rate-limit';

export async function proxy(request: NextRequest) {
  // This brochure site has no server submissions or Server Actions.
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new NextResponse('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD', 'Cache-Control': 'no-store' } });
  }
  if (process.env.RATE_LIMIT_ENABLED !== 'true') return NextResponse.next();
  try {
    // Trust only Vercel's overwritten client-IP header, not arbitrary forwarding headers.
    if (process.env.VERCEL !== '1') throw new Error('Unsupported rate limit host');
    const ip = request.headers.get('x-vercel-forwarded-for')?.trim() ?? '';
    const result = await checkRateLimit(ip);
    if (!result.allowed) {
      return new NextResponse('A little pause. Please wait a moment before trying again.', {
        status: 429, headers: { 'Retry-After': String(result.retryAfter), 'Cache-Control': 'no-store' },
      });
    }
    return NextResponse.next();
  } catch {
    // Once enabled, fail closed without leaking credentials, IPs or provider errors.
    return new NextResponse('Prana is taking a little pause. Please try again shortly.', {
      status: 503, headers: { 'Retry-After': '30', 'Cache-Control': 'no-store' },
    });
  }
}

export const config = {
  // Static assets are protected by the hosting firewall, not Redis requests.
  matcher: ['/((?!_next/static|_next/image|images/|Prana.png|favicon.ico).*)'],
};
