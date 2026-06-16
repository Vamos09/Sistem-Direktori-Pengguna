import { describe, it, expect } from "vitest";

describe("Ujian Validation E-mel", () => {
  it("E-mel yang sah perlu diterima", async () => {
    const { semakEmail } = await import("../assets/js/validation.js");
    expect(semakEmail("user@gmail.com")).toBe(true);
  });

  it("E-mel yang tidak sah perlu ditolak", async () => {
    const { semakEmail } = await import("../assets/js/validation.js");
    expect(semakEmail("usergmail")).toBe(false);
  });
});

