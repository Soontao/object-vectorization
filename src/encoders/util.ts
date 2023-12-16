import defineHiddenProperty from "../utils/defineHiddenProperty.js";
import { Vector } from "./type.js";

export const NULL_VEC_VALUE = -(2 ** 16);

export function fillMissingValues(vec: Vector) {
  if ((vec as any)?.["__missingValuesFilled"] == true) {
    return vec;
  }
  const newVec = vec.map((d) => {
    if (isNaN(d) || d == Infinity || d == -Infinity || d == null || d == undefined || typeof d !== "number") {
      return NULL_VEC_VALUE;
    }
    return d;
  });
  defineHiddenProperty(newVec, "__missingValuesFilled", true);
  return newVec;
}

/**
 * check wether the given js value is `null`
 *
 * @param value
 * @returns
 */
export function isNull(value: any): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value == "number" && (isNaN(value) || value == Infinity || value == -Infinity))
  );
}

/**
 * create null vector with given length
 * @param length
 * @returns
 */
export function nullVector(length: number): Array<number> {
  return new Array(length).fill(NULL_VEC_VALUE);
}

/**
 * check wether the given vector represented a null value
 *
 * @param vec
 * @returns
 */
export function isNullVector(vec: Vector): boolean {
  return vec.every((v) => v === NULL_VEC_VALUE);
}

export function newVector(values: Array<number>, features: Array<string>): Vector {
  defineHiddenProperty(values, "__features", features);
  return values as any;
}
