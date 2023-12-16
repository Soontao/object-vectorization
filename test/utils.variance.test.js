import { variance } from "../src/utils/variance.js";

describe("variance", () => {

  it("calculates the variance correctly", () => {
    // Arrange
    const values = [1, 2, 3, 4, 5];

    // Act
    const result = variance(values);

    // Assert
    expect(result).toBeCloseTo(2); // Use toBeCloseTo for floating-point comparisons
  });

  it("returns 0 for an empty array", () => {
    // Arrange
    const values = [];

    // Act
    const result = variance(values);

    // Assert
    expect(result).toBe(0);
  });

  it("returns 0 for an array with a single element", () => {
    // Arrange
    const values = [42];

    // Act
    const result = variance(values);

    // Assert
    expect(result).toBe(0);
  });


  it("returns NaN when given an array with NaN values", () => {
    // Arrange
    const values = [1, 2, NaN, 4, 5];

    // Act
    const result = variance(values);

    // Assert
    expect(result).toBeNaN();
  });

  it("returns NaN when given an array with non-numeric values", () => {
    // Arrange
    const values = [1, 2, "three", 4, 5];

    // Act
    const result = variance(values);

    // Assert
    expect(result).toBeNaN();
  });

});
