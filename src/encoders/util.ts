import { Vector } from "./type.js";

export function isNull(value: any): boolean {
  return value === null || value === undefined || (typeof value == "number" && isNaN(value));
}

export function nullVector(length: number): Vector {
  return new Array(length).fill(-(2 ** 16));
}
