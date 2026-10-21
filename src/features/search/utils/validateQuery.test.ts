import { describe, expect, it } from "vitest";
import { MAX_QUERY_LENGTH, validateQuery } from "./validateQuery";

describe("validateQuery", () => {
  it("accepts a normal query", () => {
    expect(validateQuery("react hooks")).toEqual({
      ok: true,
      query: "react hooks",
    });
  });

  it.each(["", "   ", "\t\n", "\u3000"])("rejects empty input %j", (raw) => {
    expect(validateQuery(raw)).toEqual({ ok: false, reason: "empty" });
  });

  it("trims and collapses whitespace", () => {
    expect(validateQuery("  react   hooks  ")).toEqual({
      ok: true,
      query: "react hooks",
    });
  });

  it("treats the full-width Japanese space as whitespace", () => {
    expect(validateQuery("react\u3000hooks")).toEqual({
      ok: true,
      query: "react hooks",
    });
  });

  it("accepts exactly the maximum length", () => {
    expect(validateQuery("a".repeat(MAX_QUERY_LENGTH)).ok).toBe(true);
  });

  it("rejects one character over the maximum", () => {
    expect(validateQuery("a".repeat(MAX_QUERY_LENGTH + 1))).toEqual({
      ok: false,
      reason: "too-long",
    });
  });

  it("keeps GitHub qualifiers intact", () => {
    expect(validateQuery("react stars:>1000 language:typescript")).toEqual({
      ok: true,
      query: "react stars:>1000 language:typescript",
    });
  });
});
