import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit } from '../lib/rate-limit.ts';

const env = { UPSTASH_REDIS_REST_URL: 'https://example.test', UPSTASH_REDIS_REST_TOKEN: 'test-token', RATE_LIMIT_SECRET: 'a'.repeat(32) };
test('allows request 120, blocks 121, and hashes the IP before storage', async () => {
  let count = 119;
  const send = async (_, options) => {
    const command = JSON.parse(options.body);
    assert.equal(command[0], 'EVAL');
    assert.match(command[3], /^prana:requests:[a-f0-9]{64}$/);
    assert.ok(!options.body.includes('192.0.2.1'));
    assert.equal(options.cache, 'no-store');
    return Response.json({ result: [++count, 42] });
  };
  assert.deepEqual(await checkRateLimit('192.0.2.1', env, send), { allowed: true, remaining: 0, retryAfter: 42 });
  assert.deepEqual(await checkRateLimit('192.0.2.1', env, send), { allowed: false, remaining: 0, retryAfter: 42 });
});
test('rejects untrusted IP values, insecure Redis URLs and incomplete configuration', async () => {
  for (const ip of ['', 'spoofed', '192.0.2.1, 192.0.2.2']) await assert.rejects(checkRateLimit(ip, env));
  await assert.rejects(checkRateLimit('::1', {}));
  await assert.rejects(checkRateLimit('::1', { ...env, UPSTASH_REDIS_REST_URL: 'http://example.test' }));
});
test('provider errors and malformed counters fail closed; expired window can admit requests again', async () => {
  for (const data of [{error:'unavailable'}, {result:[1,-1]}, {result:['1',60]}]) {
    await assert.rejects(checkRateLimit('::1', env, async () => Response.json(data)));
  }
  await assert.rejects(checkRateLimit('::1', env, async () => new Response('', {status:503})));
  assert.equal((await checkRateLimit('::1', env, async () => Response.json({result:[1,60]}))).allowed, true);
});
