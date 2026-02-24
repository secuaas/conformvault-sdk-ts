import { describe, it, expect, vi, afterEach } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifyWebhookSignature, ConformVaultError } from '../src/index.js';

function computeHMAC(timestamp: string, payload: string, secret: string): string {
  const mac = createHmac('sha256', secret);
  mac.update(`${timestamp}.${payload}`);
  return mac.digest('hex');
}

describe('verifyWebhookSignature', () => {
  const secret = 'whsec_test123';
  const payload = '{"event":"file.uploaded","file_id":"f1"}';

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should verify a valid signature', () => {
    const now = Math.floor(Date.now() / 1000);
    const timestamp = String(now);
    const hmacHex = computeHMAC(timestamp, payload, secret);
    const sigHeader = `t=${timestamp},s0=${hmacHex}`;

    expect(verifyWebhookSignature(payload, sigHeader, secret)).toBe(true);
  });

  it('should reject an invalid signature', () => {
    const now = Math.floor(Date.now() / 1000);
    const sigHeader = `t=${now},s0=bad_signature_value_that_is_definitely_wrong_aabbcc`;

    expect(verifyWebhookSignature(payload, sigHeader, secret)).toBe(false);
  });

  it('should reject a signature with the wrong secret', () => {
    const now = Math.floor(Date.now() / 1000);
    const timestamp = String(now);
    const hmacHex = computeHMAC(timestamp, payload, secret);
    const sigHeader = `t=${timestamp},s0=${hmacHex}`;

    expect(verifyWebhookSignature(payload, sigHeader, 'wrong-secret')).toBe(false);
  });

  it('should reject an expired signature', () => {
    // 10 minutes ago (beyond the 5-minute default tolerance)
    const oldTimestamp = String(Math.floor(Date.now() / 1000) - 600);
    const hmacHex = computeHMAC(oldTimestamp, payload, secret);
    const sigHeader = `t=${oldTimestamp},s0=${hmacHex}`;

    expect(verifyWebhookSignature(payload, sigHeader, secret)).toBe(false);
  });

  it('should accept a signature within custom tolerance', () => {
    // 4 minutes ago
    const timestamp = String(Math.floor(Date.now() / 1000) - 240);
    const hmacHex = computeHMAC(timestamp, payload, secret);
    const sigHeader = `t=${timestamp},s0=${hmacHex}`;

    // Default tolerance is 300s (5 min), so 4 min ago should pass
    expect(verifyWebhookSignature(payload, sigHeader, secret, 300)).toBe(true);
  });

  it('should reject a signature outside custom tolerance', () => {
    // 4 minutes ago
    const timestamp = String(Math.floor(Date.now() / 1000) - 240);
    const hmacHex = computeHMAC(timestamp, payload, secret);
    const sigHeader = `t=${timestamp},s0=${hmacHex}`;

    // Custom tolerance of 60s
    expect(verifyWebhookSignature(payload, sigHeader, secret, 60)).toBe(false);
  });

  it('should accept Buffer payload', () => {
    const now = Math.floor(Date.now() / 1000);
    const timestamp = String(now);
    const hmacHex = computeHMAC(timestamp, payload, secret);
    const sigHeader = `t=${timestamp},s0=${hmacHex}`;

    expect(verifyWebhookSignature(Buffer.from(payload), sigHeader, secret)).toBe(true);
  });

  it('should throw on missing timestamp in header', () => {
    const sigHeader = 's0=abcdef1234567890';

    expect(() =>
      verifyWebhookSignature(payload, sigHeader, secret),
    ).toThrow(ConformVaultError);
    expect(() =>
      verifyWebhookSignature(payload, sigHeader, secret),
    ).toThrow('Invalid webhook signature header format');
  });

  it('should throw on missing signature in header', () => {
    const sigHeader = 't=1234567890';

    expect(() =>
      verifyWebhookSignature(payload, sigHeader, secret),
    ).toThrow(ConformVaultError);
  });

  it('should throw on invalid timestamp value', () => {
    const sigHeader = 't=notanumber,s0=abcdef1234567890';

    expect(() =>
      verifyWebhookSignature(payload, sigHeader, secret),
    ).toThrow('Invalid timestamp');
  });

  it('should handle spaces in header gracefully', () => {
    const now = Math.floor(Date.now() / 1000);
    const timestamp = String(now);
    const hmacHex = computeHMAC(timestamp, payload, secret);
    const sigHeader = `t= ${timestamp}, s0= ${hmacHex}`;

    // The parser trims whitespace, so this should still work
    expect(verifyWebhookSignature(payload, sigHeader, secret)).toBe(true);
  });
});
