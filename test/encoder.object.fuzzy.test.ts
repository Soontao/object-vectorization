// @ai
// @human
import { metadataValidator } from "../src/encoders/Metadata.js";
import { generateRandomData, generateRandomMetadata } from "./test.utils.js";

describe("Random Fuzzy Test for ObjectEncoder", () => {
  it("should support generate random meta", () => {
    const randomMetadata = generateRandomMetadata(2);
    expect(randomMetadata).not.toBeUndefined();
  });

  it("should fuzzy randomly check validation", () => {
    for (const _ of Array(100).fill(0)) {
      const m = generateRandomMetadata(5) as any;
      const r = metadataValidator(m) as any;
      expect(metadataValidator.errors).toBeNull();
      expect(r).toBeTruthy();
    }
  });
  it("should fuzzy randomly generate data", () => {
    for (const _ of Array(100).fill(0)) {
      const m = generateRandomMetadata(5) as any;
      const data = generateRandomData(m);
      expect(data).not.toBeUndefined();
    }
  });
});
