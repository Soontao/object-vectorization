import { Encoder } from "./Encoder";
import { Vector } from "./type";

/**
 * @ai
 */
export class NumericEncoder implements Encoder<number> {
  features(name: string): string[] {
    return [name];
  }

  encode(value: number): Vector {
    if (isNaN(value)) {
      throw new Error("Invalid numeric value");
    }

    return [value];
  }

  decode(vec: Vector): number {
    if (vec.length !== this.length) {
      throw new Error("Invalid vector length");
    }

    return vec[0];
  }

  get length(): number {
    return 1; // Only one component for numeric encoding
  }
}

export default NumericEncoder;
