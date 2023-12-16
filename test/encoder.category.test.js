// ai
import CategoryEncoder from "../src/encoders/CategoryEncoder.js";
import { nullVector } from "../src/encoders/util.js";

describe("CategoryEncoder Test Suite", () => {
  it("should encode and decode values correctly", () => {
    // Arrange
    const categories = ["A", "B", "C"];
    const encoder = new CategoryEncoder({ values: categories });

    // Act
    const encodedA = encoder.encode("A");
    const encodedB = encoder.encode("B");
    const encodedC = encoder.encode("C");

    // Assert
    expect(encodedA).toEqual([1, 0, 0]);
    expect(encodedB).toEqual([0, 1, 0]);
    expect(encodedC).toEqual([0, 0, 1]);

    // Decode and assert
    expect(encoder.decode(encodedA)).toBe("A");
    expect(encoder.decode(encodedB)).toBe("B");
    expect(encoder.decode(encodedC)).toBe("C");
  });

  it("should support list feature names", () => {
    // Arrange
    const categories = ["A", "B", "C"];
    const encoder = new CategoryEncoder({ name: 'c_1', values: categories });

    expect(encoder.features("c_1")).toMatchSnapshot();
  });

  it("should handle null value", () => {
    // Arrange
    const categories = ["A", "B", "C"];
    const encoder = new CategoryEncoder({ values: categories });

    // Act
    const encodedNull = encoder.encode(null);

    // Assert
    expect(encodedNull).toEqual(nullVector(encoder.length)); // Assuming null is represented as all zeros

    // Decode and assert
    expect(encoder.decode(encodedNull)).toBeNull();
  });

  it("should encode and decode values correctly for different types", () => {
    // Arrange
    const categories = [Symbol("A"), "B", 42, true];
    const encoder = new CategoryEncoder({ values: categories });

    // Act
    const encodedSymbolA = encoder.encode(categories[0]);
    const encodedStringB = encoder.encode("B");
    const encodedNumber42 = encoder.encode(42);
    const encodedBoolTrue = encoder.encode(true);

    // Assert
    expect(encodedSymbolA).toEqual([1, 0, 0, 0]);
    expect(encodedStringB).toEqual([0, 1, 0, 0]);
    expect(encodedNumber42).toEqual([0, 0, 1, 0]);
    expect(encodedBoolTrue).toEqual([0, 0, 0, 1]);

    // Decode and assert
    expect(encoder.decode(encodedSymbolA)).toBe(categories[0]);
    expect(encoder.decode(encodedStringB)).toBe("B");
    expect(encoder.decode(encodedNumber42)).toBe(42);
    expect(encoder.decode(encodedBoolTrue)).toBe(true);
  });
});
