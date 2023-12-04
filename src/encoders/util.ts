import { Vector } from "./type.js";

const NULL_VEC_VALUE = -(2 ** 16);

/**
 * check wether the given js value is `null`
 *
 * @param value
 * @returns
 */
export function isNull(value: any): boolean {
  return value === null || value === undefined || (typeof value == "number" && isNaN(value));
}

/**
 * create null vector with given length
 * @param length
 * @returns
 */
export function nullVector(length: number): Vector {
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
