import { randomUUID } from "crypto";
import { murmurhash3 } from "../src/utils/MurmurHash.js";

describe("Utils Test Suite", () => {
  it("should return the correct hash value for a given key and seed", () => {
    expect(murmurhash3("Hello, MurmurHash!", 42)).toEqual(363275047);
    expect(murmurhash3("Jest is awesome!", 123)).toEqual(2017758788);
  });

  it("should return the same hash value for the same key and seed", () => {
    const key = "Test Key";
    const seed = 987;

    expect(murmurhash3(key, seed)).toBe(murmurhash3(key, seed));
  });

  it("should pass fuzzy test for murmurhash3", () => {
    for (const _ of Array(500).fill(0)) {
      const h = murmurhash3(randomUUID());
      expect(h).toBeGreaterThan(0);
      expect(h).toBeLessThan(2 ** 32 - 1);
    }
  });
});
