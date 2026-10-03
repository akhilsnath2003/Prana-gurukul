import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    const production = process.env.NODE_ENV === 'production';
    // Static Next.js pages contain inline hydration scripts. Keep this explicit:
    // this baseline restricts origins but is not a nonce-based XSS policy.
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${production ? '' : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'", // GSAP and Radix use inline styles.
      "img-src 'self' data: blob:",
      "font-src 'self'",
      `connect-src 'self'${production ? '' : ' ws: wss:'}`,
      "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'",
      "form-action 'self'", ...(production ? ['upgrade-insecure-requests'] : []),
    ].join('; ');
    return [{ source: '/:path*', headers: [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
      ...(production ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }] : []),
    ] }];
  },
};

export default nextConfig;
