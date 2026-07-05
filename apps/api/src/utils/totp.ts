import crypto from 'crypto';

export function generate2FASecret(): string {
  return crypto.randomBytes(20).toString('hex');
}

export function generateTOTP(secret: string, counter: number): string {
  // Convert counter to 8-byte buffer
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter), 0);

  // Use SHA-1 hash of the secret string to get a 20-byte key
  const secretKey = crypto.createHash('sha1').update(secret).digest();

  // HMAC-SHA1
  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(buffer);
  const hmacResult = hmac.digest();

  // Dynamic truncation
  const offset = hmacResult[hmacResult.length - 1] & 0xf;
  const code =
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff);

  const otp = code % 1000000;
  return otp.toString().padStart(6, '0');
}

export function verifyTOTP(token: string, secret: string): boolean {
  const currentTime = Math.floor(Date.now() / 1000);
  const currentCounter = Math.floor(currentTime / 30);

  // Allow a window of 1 time step before and after for clock drift
  for (let i = -1; i <= 1; i++) {
    const expected = generateTOTP(secret, currentCounter + i);
    if (expected === token) {
      return true;
    }
  }
  return false;
}
