# `@lucid-softworks/http-cookies`

Cookie request parsing and `Set-Cookie` serialization.

```ts
import {
  parseCookieHeader,
  serializeCookie,
} from "@lucid-softworks/http-cookies";

const request = new Request("https://example.com", {
  headers: { cookie: "theme=dark; session=token" },
});
const cookies = parseCookieHeader(request.headers.get("cookie"));
const header = serializeCookie("session", "token", {
  httpOnly: true,
  sameSite: "Lax",
  secure: true,
});
```

Malformed percent escapes remain readable instead of throwing. Cookie names
are validated, and `deleteCookie` creates an immediately expired value.
