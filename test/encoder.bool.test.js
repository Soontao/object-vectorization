// ai+human
import BoolEncoder from "../src/encoders/BoolEncoder.js";
import { nullVector } from "../src/encoders/util.js";

describe("BoolEncoder Test Suite", () => {
  it("should encode and decode boolean values correctly", () => {
    // Arrange
    const encoder = new BoolEncoder();

    // Act
    const encodedTrue = encoder.encode(true);
    const encodedFalse = encoder.encode(false);
    const decodedTrue = encoder.decode(encodedTrue);
    const decodedFalse = encoder.decode(encodedFalse);

    // Assert
    expect(encodedTrue).toEqual([1, 0]);
    expect(encodedFalse).toEqual([0, 1]);
    expect(decodedTrue).toBe(true);
    expect(decodedFalse).toBe(false);

    expect(encoder.encode(null)).toEqual(nullVector(encoder.length));
    expect(encoder.encode(undefined)).toEqual(nullVector(encoder.length));
  });

  it("should handle invalid vector length during decoding", () => {
    // Arrange
    const encoder = new BoolEncoder();
    const invalidVector = [1]; // Invalid length

    // Act & Assert
    expect(() => encoder.decode(invalidVector)).toThrow("Invalid vector length");
  });

  it("should handle invalid boolean value during encoding", () => {
    // Arrange
    const encoder = new BoolEncoder();

    // Act & Assert
    expect(encoder.encode(null)).toEqual(nullVector(encoder.length));
    expect(encoder.decode(nullVector(encoder.length))).toBeNull();
  });
});
