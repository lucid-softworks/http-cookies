export type CookieSameSite = "Strict" | "Lax" | "None";

export type SerializeCookieOptions = Readonly<{
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: CookieSameSite;
  secure?: boolean;
}>;

function decodeCookie(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Parses a Cookie request header. Later duplicate names win. */
export function parseCookieHeader(
  header: string | null,
): Readonly<Record<string, string>> {
  const cookies: Record<string, string> = {};
  if (header === null || header.trim() === "") return cookies;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const name = part.slice(0, index).trim();
    if (name !== "") cookies[name] = decodeCookie(part.slice(index + 1).trim());
  }
  return cookies;
}

/** Serializes one Set-Cookie header value. */
export function serializeCookie(
  name: string,
  value: string,
  options: SerializeCookieOptions = {},
): string {
  if (!/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/u.test(name)) {
    throw new TypeError("cookie name contains invalid characters");
  }
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined)
    parts.push(`Max-Age=${Math.trunc(options.maxAge)}`);
  if (options.domain !== undefined) parts.push(`Domain=${options.domain}`);
  if (options.path !== undefined) parts.push(`Path=${options.path}`);
  if (options.expires !== undefined)
    parts.push(`Expires=${options.expires.toUTCString()}`);
  if (options.httpOnly === true) parts.push("HttpOnly");
  if (options.secure === true) parts.push("Secure");
  if (options.sameSite !== undefined)
    parts.push(`SameSite=${options.sameSite}`);
  return parts.join("; ");
}

export function deleteCookie(
  name: string,
  options: Omit<SerializeCookieOptions, "expires" | "maxAge"> = {},
): string {
  return serializeCookie(name, "", {
    ...options,
    expires: new Date(0),
    maxAge: 0,
  });
}
