// ai
import NumericEncoder from "../src/encoders/NumericEncoder";

describe("NumericEncoder Test Suite", () => {
  it("should encode and decode numeric values correctly", () => {
    // Arrange
    const encoder = new NumericEncoder();
    const numericValue = 42;

    // Act
    const encodedVector = encoder.encode(numericValue);
    const decodedNumericValue = encoder.decode(encodedVector);

    // Assert
    expect(encodedVector).toEqual([42]);
    expect(decodedNumericValue).toBe(42);
  });

  it("should handle invalid numeric value during encoding", () => {
    // Arrange
    const encoder = new NumericEncoder();

    // Act & Assert
    expect(() => encoder.encode(NaN)).toThrow("Invalid numeric value");
  });

  it("should handle invalid vector length during decoding", () => {
    // Arrange
    const encoder = new NumericEncoder();
    const invalidVector = [1, 2]; // Invalid length

    // Act & Assert
    expect(() => encoder.decode(invalidVector)).toThrow("Invalid vector length");
  });
});
