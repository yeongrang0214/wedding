export const AUTH_COOKIE_NAME = "wedding_site_access";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const encoder = new TextEncoder();

export async function createAccessToken(password: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`yeongnyang-sangmung-wedding:${password}`),
  );

  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function constantTimeEqual(left: string, right: string) {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;

  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }

  return difference === 0;
}
