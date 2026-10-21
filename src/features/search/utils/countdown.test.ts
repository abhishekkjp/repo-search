import { describe, expect, it } from "vitest";
import { getSecondsRemaining } from "./countdown";

const NOW = Date.parse("2026-10-21T12:00:00Z");

describe("getSecondsRemaining", () => {
  it("returns 0 when there is no reset time", () => {
    expect(getSecondsRemaining(null, NOW)).toBe(0);
  });

  it("counts whole seconds", () => {
    expect(getSecondsRemaining(new Date(NOW + 30_000), NOW)).toBe(30);
  });

  it("rounds partial seconds up, so we never say 0 too early", () => {
    expect(getSecondsRemaining(new Date(NOW + 10_200), NOW)).toBe(11);
  });

  it("never goes negative once the time has passed", () => {
    expect(getSecondsRemaining(new Date(NOW - 5_000), NOW)).toBe(0);
  });
});
