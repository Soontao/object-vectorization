import { Vector } from "../encoders/type.js";
import { fillMissingValues, isNull } from "../encoders/util.js";

/**
 * min-max value normalization
 *
 * @param vectors
 * @returns
 */
export function normalization(vectors: Array<Vector>): Array<Vector> {
  if (vectors.length === 0 || isNull(vectors)) {
    return [];
  }
  vectors = vectors.map(fillMissingValues);
  const numFeatures = vectors[0]?.length;

  // Calculate min and max values for each feature
  const minValues = new Array(numFeatures);
  const maxValues = new Array(numFeatures);

  for (const vector of vectors) {
    vector.forEach((value, index) => {
      if (minValues[index] == undefined) {
        minValues[index] = value;
      } else {
        minValues[index] = Math.min(minValues[index], value);
      }
      if (maxValues[index] == undefined) {
        maxValues[index] = value;
      } else {
        maxValues[index] = Math.max(maxValues[index], value);
      }
    });
  }

  // Apply Min-Max Scaling to each vector
  const normalizedVectors = vectors.map((vector) => {
    const newVec = vector.map((value, index) => {
      if (minValues[index] == maxValues[index]) {
        return minValues[index];
      }
      return (value - minValues[index]) / (maxValues[index] - minValues[index]);
    });
    Object.defineProperty(newVec, "__original", { value: vector, enumerable: false });
    return newVec;
  });

  return normalizedVectors;
}

export default normalization;
