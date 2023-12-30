// @ai
import { softmax } from "../src/utils/softmax";

describe("softmax", () => {
  it("calculates softmax correctly", () => {
    // Arrange
    const inputVector = [2.0, 1.0, 0.1];

    // Act
    const result = softmax(inputVector);

    // Assert
    const sum = result.reduce((acc, val) => acc + val, 0);
    const roundedResult = result.map((val) => Math.round(val * 1000) / 1000); // Round to 3 decimal places
    expect(sum).toBeCloseTo(1); // Ensure the result is a valid probability distribution
    expect(roundedResult).toEqual([0.659, 0.242, 0.099]); // Expected softmax values
  });

  it("returns an array of zeros for an empty input array", () => {
    // Arrange
    const inputVector = [];

    // Act
    const result = softmax(inputVector);

    // Assert
    expect(result).toEqual([]);
  });

  it("returns an array of zeros for an array with a single element", () => {
    // Arrange
    const inputVector = [42];

    // Act
    const result = softmax(inputVector);

    // Assert
    expect(result).toEqual([1]); // Softmax of a single element is always 1
  });

  it("returns NaN for an array with NaN values", () => {
    // Arrange
    const inputVector = [1, 2, NaN, 4, 5];

    // Act
    const result = softmax(inputVector);

    // Assert
    expect(result).toEqual([NaN, NaN, NaN, NaN, NaN]);
  });

  it("returns NaN for an array with non-numeric values", () => {
    // Arrange
    const inputVector = [1, 2, "three", 4, 5];

    // Act
    const result = softmax(inputVector);

    // Assert
    expect(result).toEqual([NaN, NaN, NaN, NaN, NaN]);
  });
});
