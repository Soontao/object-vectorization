import defineHiddenProperty from "./defineHiddenProperty.js";

/**
 * The softmax function, also known as softargmax or normalized exponential function
 * converts a vector of K real numbers into a probability distribution of K possible outcomes.
 * @ai
 * @param input
 * @returns
 */
export function softmax(input: number[]): number[] {
  const expValues = input.map(Math.exp);
  const sumExpValues = expValues.reduce((acc, val) => acc + val, 0);
  const softmaxValues = expValues.map((expVal) => expVal / sumExpValues);
  defineHiddenProperty(softmaxValues, "__original", { value: input });
  return softmaxValues;
}

export default softmax;
