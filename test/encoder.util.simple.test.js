import { NULL_VEC_VALUE, fillMissingValues } from "../src/encoders/util.js";

describe('Encoder.util Test Suite', () => {

  it('should fill NaN, Infinity, null, undefined, and non-number values with NULL_VEC_VALUE', () => {
    const vec = [1, NaN, 3, Infinity, null, undefined, 'text'];

    const filledVec = fillMissingValues(vec);

    // Expect NaN, Infinity, null, undefined, and non-number values to be replaced with NULL_VEC_VALUE
    expect(filledVec).toEqual([1, NULL_VEC_VALUE, 3, NULL_VEC_VALUE, NULL_VEC_VALUE, NULL_VEC_VALUE, NULL_VEC_VALUE]);
  });

  it('should not fill missing values if already filled', () => {
    const vec = [1, 2, 3];
    // Mark the vector as already filled
    Object.defineProperty(vec, '__missingValuesFilled', { value: true, enumerable: false });

    const filledVec = fillMissingValues(vec);

    // Expect the vector to remain unchanged as it's already marked as filled
    expect(filledVec).toEqual([1, 2, 3]);
  });

  it('should fill missing values in a vector of mixed types', () => {
    const vec = [1, 'text', NaN, 4, null, undefined, true];

    const filledVec = fillMissingValues(vec);

    // Expect NaN, null, undefined, and non-number values to be replaced with NULL_VEC_VALUE
    expect(filledVec).toEqual([1, NULL_VEC_VALUE, NULL_VEC_VALUE, 4, NULL_VEC_VALUE, NULL_VEC_VALUE, NULL_VEC_VALUE]);
  });
});
