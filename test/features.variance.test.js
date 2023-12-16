import { filterFeatByVariance } from "../src/feature_selection/filterFeatByVariance.js";

describe("filterFeatByVariance", () => {
  it("returns an empty array when data is null", () => {
    // Arrange
    const data = null;

    // Act
    const result = filterFeatByVariance(data);

    // Assert
    expect(result).toEqual([]);
  });

  it("returns an empty array when data is undefined", () => {
    // Arrange
    const data = undefined;

    // Act
    const result = filterFeatByVariance(data);

    // Assert
    expect(result).toEqual([]);
  });

  it("returns an empty array when data is an empty array", () => {
    // Arrange
    const data = [];

    // Act
    const result = filterFeatByVariance(data);

    // Assert
    expect(result).toEqual([]);
  });

  it("returns the original data when all features have variance above the threshold", () => {
    // Arrange
    const data = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const threshold = 0.01;

    // Act
    const result = filterFeatByVariance(data, threshold);

    // Assert
    expect(result).toEqual(data);
  });

  it("filters out features with variance below the threshold", () => {
    // Arrange
    const data = [
      [1, 2, 3],
      [1, 5, 6],
      [1, 8, 9],
    ];
    const threshold = 0.01;
    const expected = [
      [2, 3],
      [5, 6],
      [8, 9],
    ];

    // Act
    const result = filterFeatByVariance(data, threshold);

    // Assert
    expect(result).toEqual(expected);
  });

  it("handles NaN values in the data", () => {
    // Arrange
    const data = [
      [1, NaN, 3],
      [4, 5, 6],
      [7, 8, NaN],
    ];
    const threshold = 0.01;
    const expected = [
      [1],
      [4],
      [7],
    ];

    // Act
    const result = filterFeatByVariance(data, threshold);

    // Assert
    expect(result).toEqual(expected);
  });
});
