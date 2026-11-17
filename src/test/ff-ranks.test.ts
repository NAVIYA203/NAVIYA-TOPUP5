import { describe, expect, it } from "vitest";
import { brRankName, csRankName, isValidUid } from "@/lib/ff";

describe("Free Fire rank rules (same tables as the bot)", () => {
  it("4370 BR points is Heroic", () => expect(brRankName(4370)).toBe("Heroic"));
  it("6001 BR points is Master", () => expect(brRankName(6001)).toBe("Master"));
  it("below 700 BR points is Unranked", () => expect(brRankName(500)).toBe("Unranked"));
  it("CS 111 stars is Elite Heroic", () => expect(csRankName(111)).toBe("Elite Heroic"));
  it("UID must be 5–20 digits", () => {
    expect(isValidUid("2805365702")).toBe(true);
    expect(isValidUid("1234")).toBe(false);
    expect(isValidUid("12ab5678")).toBe(false);
  });
});
