import { describe, expect, it } from "vitest";

import {
  deleteCookie,
  parseCookieHeader,
  serializeCookie,
} from "../src/index.js";

describe("HTTP cookies", () => {
  it("parses empty, encoded, duplicate, malformed, and empty-name cookies", () => {
    expect(parseCookieHeader(null)).toEqual({});
    expect(parseCookieHeader("   ")).toEqual({});
    expect(
      parseCookieHeader("a=1; encoded=hello%20world; flag; =empty; a=2"),
    ).toEqual({
      a: "2",
      encoded: "hello world",
    });
    expect(parseCookieHeader("bad=%E0%A4%A")).toEqual({ bad: "%E0%A4%A" });
  });

  it("serializes all cookie attributes", () => {
    expect(
      serializeCookie("session", "hello world", {
        domain: "example.com",
        expires: new Date(0),
        httpOnly: true,
        maxAge: 60.9,
        path: "/",
        sameSite: "Strict",
        secure: true,
      }),
    ).toBe(
      "session=hello%20world; Max-Age=60; Domain=example.com; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict",
    );
    expect(serializeCookie("simple", "yes")).toBe("simple=yes");
    expect(() => serializeCookie("not valid", "x")).toThrow(TypeError);
  });

  it("creates deletion cookies while retaining scope", () => {
    expect(deleteCookie("session", { path: "/", secure: true })).toBe(
      "session=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure",
    );
  });
});
