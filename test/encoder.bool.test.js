// ai+human
import BoolEncoder from "../src/encoders/BoolEncoder.js";

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
    expect(encoder.encode(null)[0]).toBeNaN()
    expect(encoder.encode(null)[1]).toBeNaN()
  });
});
