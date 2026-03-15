import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatDate,
  isValidNotionId,
  normalizeNotionId,
} from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats positive integer as Korean Won", () => {
    const result = formatCurrency(1000);
    expect(result).toContain("1,000");
    expect(result).toMatch(/₩|원|KRW/);
  });

  it("formats zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });

  it("formats large amounts with thousands separator", () => {
    const result = formatCurrency(1234567);
    expect(result).toContain("1,234,567");
  });
});

describe("formatDate", () => {
  it("formats ISO date string to Korean locale", () => {
    const result = formatDate("2024-01-15");
    // Korean locale includes 년, 월, 일 characters
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/1|01/);
    expect(result).toMatch(/15/);
  });

  it("formats date with full year", () => {
    const result = formatDate("2025-12-31");
    expect(result).toContain("2025");
  });
});

describe("isValidNotionId", () => {
  it("accepts a 32-char hex string without hyphens", () => {
    expect(isValidNotionId("a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4")).toBe(true);
  });

  it("accepts a hyphenated Notion ID (8-4-4-4-12 format)", () => {
    expect(isValidNotionId("a1b2c3d4-e5f6-a1b2-c3d4-e5f6a1b2c3d4")).toBe(true);
  });

  it("rejects IDs shorter than 32 hex chars", () => {
    expect(isValidNotionId("abc123")).toBe(false);
  });

  it("rejects IDs with non-hex characters", () => {
    expect(isValidNotionId("g1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidNotionId("")).toBe(false);
  });

  it("rejects ID longer than 32 hex chars", () => {
    expect(isValidNotionId("a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4ff")).toBe(false);
  });
});

describe("normalizeNotionId", () => {
  it("removes hyphens from a UUID-style ID", () => {
    const result = normalizeNotionId("a1b2c3d4-e5f6-a1b2-c3d4-e5f6a1b2c3d4");
    expect(result).toBe("a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4");
  });

  it("lowercases uppercase hex characters", () => {
    const result = normalizeNotionId("A1B2C3D4E5F6A1B2C3D4E5F6A1B2C3D4");
    expect(result).toBe("a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4");
  });

  it("returns already-clean IDs unchanged", () => {
    const id = "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4";
    expect(normalizeNotionId(id)).toBe(id);
  });
});
