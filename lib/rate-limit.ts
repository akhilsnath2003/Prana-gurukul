import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';

const script = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], 60) end
return {count, redis.call('TTL', KEYS[1])}
`;

export async function checkRateLimit(ip: string, env = process.env, send: typeof fetch = fetch) {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  const secret = env.RATE_LIMIT_SECRET;
  if (!url || !token || !secret || secret.length < 32 || !isIP(ip)) throw new Error('Invalid rate limit configuration');
  const endpoint = new URL(url);
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) throw new Error('Redis requires HTTPS');
  const key = 'prana:requests:' + createHmac('sha256', secret).update(ip).digest('hex');
  const response = await send(endpoint, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', script, '1', key]),
    cache: 'no-store', signal: AbortSignal.timeout(2000), redirect: 'error',
  });
  if (!response.ok) throw new Error('Rate limit service unavailable');
  const data = await response.json();
  if (data.error || !Array.isArray(data.result) || data.result.length !== 2) throw new Error('Invalid rate limit response');
  const [count, ttl] = data.result;
  if (!Number.isInteger(count) || count < 1 || !Number.isInteger(ttl) || ttl < 0) throw new Error('Invalid rate limit counters');
  return { allowed: count <= 120, remaining: Math.max(0, 120 - count), retryAfter: Math.max(1, ttl) };
}
