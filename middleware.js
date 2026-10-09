import { next } from '@vercel/functions';

const LOGIN_REQUIRED = true;
// sha256 (hex) of "username:password"
const CREDENTIALS_SHA256 = 'a02e836db7c4cea95dc9e22a3cbc3a42a1b38db3dde7800995f4b61af582263d';

export const config = { matcher: '/:path*' };

async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function parseBasic(header) {
  if (!header || !header.startsWith('Basic ')) return null;
  try {
    const bytes = Uint8Array.from(atob(header.slice(6).trim()), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function unauthorized() {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Demo", charset="UTF-8"',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export default async function middleware(request) {
  if (!LOGIN_REQUIRED) return next();

  const supplied = parseBasic(request.headers.get('authorization'));
  if (supplied === null) return unauthorized();

  const suppliedHash = await sha256Hex(supplied);
  if (!constantTimeEqual(suppliedHash, CREDENTIALS_SHA256)) return unauthorized();

  return next();
}
