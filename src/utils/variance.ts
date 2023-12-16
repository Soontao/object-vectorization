/**
 * @human
 * @ai
 * @param values
 * @returns the variance of numbers
 */
export function variance(values: Array<number>) {
  if (values.length == 0) {
    return 0;
  }
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const squaredDifferencesSum = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0);
  return squaredDifferencesSum / values.length;
}
