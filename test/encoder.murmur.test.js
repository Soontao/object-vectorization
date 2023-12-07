import { MurmurEncoder } from "../src/encoders/MurmurEncoder.js";

describe("MurmurEncoder Test Suite", () => {
  it("should support int test", () => {
    expect(new MurmurEncoder(42).encode("Hello Vector!")).toMatchSnapshot();
    expect(new MurmurEncoder(500).encode("Hello Vector!")).toMatchSnapshot();
  });
  it("should have a length of 1", () => {
    const encoder = new MurmurEncoder();
    expect(encoder.length).toEqual(1);
  });

  it("should return feature array with the provided name", () => {
    const encoder = new MurmurEncoder();
    const featureName = "test_feature";

    const features = encoder.features(featureName);

    expect(features).toEqual([featureName]);
  });

  it("should throw an error when decoding is attempted", () => {
    const encoder = new MurmurEncoder();
    const encodedVector = [123];

    expect(() => encoder.decode(encodedVector)).toThrow("Decoding is not implemented for MurmurEncoder.");
  });
});
