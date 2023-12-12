// @ts-nocheck
import { normalization } from "../src/utils/normalization.js";

describe("Normalization Test Suite", () => {
  it("should normalize vectors using Min-Max Scaling", () => {
    const vectors = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const normalizedVectors = normalization(vectors);

    // Ensure the normalized vectors have values between 0 and 1
    normalizedVectors.forEach((vector) => {
      vector.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });
    expect(normalizedVectors[0].__original).toEqual(vectors[0]);
    expect(normalizedVectors).toMatchSnapshot();
  });

  it("should handle empty vectors array", () => {
    const vectors: number[][] = [];
    const normalizedVectors = normalization(vectors);

    // Expect the result to be an empty array
    expect(normalizedVectors).toEqual([]);
  });

  it("should handle vectors with null values", () => {
    const vectors = [
      [1, 2, 3],
      [null, 5, 6],
      [7, 8, null],
    ];

    // Normalize vectors with null values
    const normalizedVectors = normalization(vectors);

    expect(normalizedVectors).toMatchSnapshot();
  });

  it("should handle vectors with random values", () => {
    const vectors = [
      [Math.random(), Math.random(), Math.random()],
      [Math.random(), Math.random(), Math.random()],
      [Math.random(), Math.random(), Math.random()],
    ];

    // Normalize vectors with random values
    const normalizedVectors = normalization(vectors);

    // Expect the result to have values between 0 and 1
    normalizedVectors.forEach((vector) => {
      vector.forEach((value) => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      });
    });
  });

  it("should handle vectors with all zero values", () => {
    const vectors = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    // Normalize vectors with all zero values
    const normalizedVectors = normalization(vectors);

    // Expect the result to have values of 0 for all elements
    normalizedVectors.forEach((vector) => {
      vector.forEach((value) => {
        expect(value).toEqual(0);
      });
    });
    expect(normalizedVectors).toMatchSnapshot();
  });
});
