import { MurmurEncoder } from "../src/encoders/MurmurEncoder.js";

describe("MurmurEncoder Test Suite", () => {
  it("should support int test", () => {
    expect(new MurmurEncoder({ name: "root", type: 'murmur_hash', hash_seed: 42 }).encode("Hello Vector!")).toMatchSnapshot();
    expect(new MurmurEncoder({ name: "root", type: 'murmur_hash', hash_seed: 500 }).encode("Hello Vector!")).toMatchSnapshot();
    expect(new MurmurEncoder({ name: "root", type: 'murmur_hash' }).encode(null)).toMatchSnapshot();
    expect(new MurmurEncoder({ name: "root", type: 'murmur_hash' }).encode(undefined)).toMatchSnapshot();
  });
  it("should have a length of 1", () => {
    const encoder = new MurmurEncoder({ name: "root", type: 'murmur_hash' });
    expect(encoder.length).toEqual(1);
  });

  it("should return feature array with the provided name", () => {
    const encoder = new MurmurEncoder({ name: "test_feature", type: 'murmur_hash' });

    const features = encoder.features();

    expect(features).toEqual(['test_feature']);
  });

  it("should throw an error when decoding is attempted", () => {
    const encoder = new MurmurEncoder({ name: "root", type: 'murmur_hash' });
    const encodedVector = [123];

    expect(() => encoder.decode(encodedVector)).toThrow("Decoding is not implemented for MurmurEncoder.");
  });
});
