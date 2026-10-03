# Deploying Prana Gurukul

## Recommended route: Vercel + the client's existing domain

The domain can stay with its current registrar. Create hosting and Redis accounts
owned by the client, invite yourself, and enable multi-factor authentication.
Check current plan terms and pricing for a commercial school website before buying.
Nothing in this change creates a paid account, connects DNS or deploys the site.

1. Push the project to a private Git repository. Do not upload `.env` files.
2. Import it into Vercel as Next.js. Use Node 22 or newer and `npm run build`.
3. Create an Upstash Redis database near the hosting region. Put its REST URL
   and REST token in Vercel's server environment settings using the names in
   `.env.example`. Generate `RATE_LIMIT_SECRET` using the command in that file.
4. Set `RATE_LIMIT_ENABLED=true` and redeploy. Configure Preview separately;
   use a separate database or secret so preview traffic has a separate limit.
5. Test the preview before connecting the domain. The limiter allows 120 page
   requests per IP per 60-second fixed window, then returns 429 with Retry-After.
   It shares counters across instances, stores HMACs rather than raw IPs, and
   expires keys after 60 seconds. A window boundary can allow a short burst.
   Shared school/office networks share a quota; tune based on observed traffic.
6. Enable Vercel's firewall/bot protections and configure an edge rate-limit rule
   suitable for the selected plan. Protect static files too. Application rate
   limiting still invokes compute and Redis; it does not stop volumetric DDoS
   or prevent all hosting costs. Set billing alerts and monitor 429/503 rates.
7. Add the domain under Vercel Project Settings → Domains. At the registrar,
   enter exactly the DNS records Vercel displays. Preserve MX/TXT email records.
   Wait for DNS verification and HTTPS certificate issuance, then choose one
   canonical domain and redirect the alternate hostname.
8. Confirm HTTPS, image loading, scrolling, tabs, FAQ, visit email draft, chat,
   mobile layout, 404, and recovery screens. Inspect security response headers.

## What is active and what needs setup

- Security headers and generic error pages are included in the Next.js build.
- Rate limiting is OFF unless `RATE_LIMIT_ENABLED=true`. A missing Redis
  connection, missing trusted IP or unsupported host returns 503 when enabled;
  it does not silently bypass the limit. Redis outages therefore affect page
  availability. Set up service monitoring before launch.
- The limiter is designed for requests arriving directly through Vercel. Do not
  put another proxy in front without reviewing IP handling. It deliberately does
  not trust arbitrary `X-Forwarded-For` headers or simulate IP limits in memory.
- GET and HEAD are the only supported page methods. The form creates a local
  email draft and the chat runs locally. Neither currently has a submission API.
  Before adding Server Actions or APIs, revise the method policy and add server
  validation, endpoint-specific limits, origin/CSRF controls and spam prevention.
- Assets bypass the Redis limiter to avoid throttling normal image/script loads;
  host-level firewall rules must cover those paths, including image optimization.
- CSP restricts resource origins, framing, plugins and base URLs. Static Next.js
  hydration requires inline scripts in this configuration; it is NOT a strict
  nonce-based XSS policy. GSAP/Radix also need inline styles. Do not add unsanitized
  HTML. A stricter nonce policy would require reviewing dynamic rendering/caching.
- HTTPS/HSTS is configured for production without forcing all subdomains. Use
  `npm run dev` for local HTTP development.
- Loading UI appears when a route suspends; a fast static homepage may not show it.

## Release checks

```sh
npm ci
npm audit --omit=dev
node --experimental-strip-types --test tests/rate-limit.test.mjs
npm run typecheck
npm run build
```

Test 429 responses against an isolated preview with Redis enabled, not the live
school site. Verify a fresh request succeeds after 60 seconds, and that disabling
Redis in the preview produces 503. Unit tests mock Redis; they do not validate
your actual Redis connection, hosting firewall or domain configuration.

Keep Next.js and dependencies patched, review advisories before each release,
restrict account access, rotate leaked credentials, and keep a known-good
deployment available for rollback. No configuration makes a website attack-proof.

References: [Vercel rate limiting](https://vercel.com/kb/guide/add-rate-limiting-vercel),
[trusted request headers](https://vercel.com/docs/headers/request-headers),
[Next.js CSP](https://nextjs.org/docs/app/guides/content-security-policy),
[Upstash REST API](https://upstash.com/docs/redis/features/restapi).
