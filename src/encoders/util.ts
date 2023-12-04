import { Vector } from "./type.js";

const NULL_VEC_VALUE = -(2 ** 16);

export function isNull(value: any): boolean {
  return value === null || value === undefined || (typeof value == "number" && isNaN(value));
}

export function nullVector(length: number): Vector {
  return new Array(length).fill(NULL_VEC_VALUE);
}

export function isNullVector(vec: Vector): boolean {
  return vec.every((v) => v === NULL_VEC_VALUE);
}
