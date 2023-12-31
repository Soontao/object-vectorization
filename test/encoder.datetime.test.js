// ai+human
import DateTimeEncoder from "../src/encoders/DateTimeEncoder.js";
import { nullVector } from "../src/encoders/util.js";

describe("DateTimeEncoder Test Suite", () => {
  it("should encode and decode date-time values correctly", () => {
    // Arrange
    const encoder = new DateTimeEncoder({});

    // Act
    const encodedVector = encoder.encode("2023-12-01T12:34:56.789Z");
    const decodedDateTime = encoder.decode(encodedVector);

    // Assert
    const expectedVector = [2023, 12, 1, 48, 12, 34, 56];
    expect(encodedVector).toEqual(expectedVector);

    const expectedISODateTime = "2023-12-01T12:34:56.000Z";
    expect(decodedDateTime).toBe(expectedISODateTime);
  });

  it("should handle invalid date format during encoding", () => {
    // Arrange
    const encoder = new DateTimeEncoder({});

    // Act
    const encodedVector = encoder.encode("invalid-date");

    // Assert
    const expectedVector = nullVector(encoder.length);
    expect(encodedVector).toEqual(expectedVector);
  });

  it("should handle invalid vector length during decoding", () => {
    // Arrange
    const encoder = new DateTimeEncoder({});
    const invalidVector = [1, 2, 3, 4, 5, 6]; // Invalid length

    // Act & Assert
    expect(() => encoder.decode(invalidVector)).toThrow("Invalid vector length");
  });

  it("should handle all NaN values during decoding", () => {
    // Arrange
    const encoder = new DateTimeEncoder({});
    const nanVector = nullVector(encoder.length);

    // Act
    const decodedDateTime = encoder.decode(nanVector);

    // Assert
    expect(decodedDateTime).toBe(null);
  });
});
