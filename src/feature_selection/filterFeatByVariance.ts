import { Vector } from "../encoders/type.js";
import { variance } from "../utils/variance.js";

// TODO: also filter features

export function filterFeatByVariance(data: Array<Vector>, threshold = 0.01): Array<Vector> {
  if (data == null || data == undefined || data?.length === 0) {
    return [];
  }

  const numFeatures = data?.[0].length;

  // Calculate variance for each feature
  const variances = Array.from({ length: numFeatures }, (_, featureIndex) => {
    const featureValues = data.map((row) => row[featureIndex]);
    return variance(featureValues) || 0; // Replace null with 0
  });

  // Filter out features with variance below the threshold
  const selectedFeatures = variances
    .map((variance, index) => ({ index, variance }))
    .filter((feature) => isNaN(feature.variance) || feature.variance >= threshold)
    .map((feature) => feature.index);

  return data.map((row) => selectedFeatures.map((index) => row[index]));
}

export default filterFeatByVariance;
