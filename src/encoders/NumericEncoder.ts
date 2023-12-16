import { AbstractEncoder } from "./Encoder.js";
import { Vector } from "./type.js";
import { isNull, isNullVector, nullVector } from "./util.js";

/**
 * @ai
 */
export class NumericEncoder extends AbstractEncoder<number> {
  features(): string[] {
    return [this._property.name];
  }

  encode(value: number): Vector {
    if (isNull(value)) {
      return nullVector(this.length);
    }

    return this.withFeatures([value]);
  }

  decode(vec: Vector): number {
    if (vec.length !== this.length) {
      throw new Error("Invalid vector length");
    }

    if (isNullVector(vec)) {
      return null as any;
    }

    return vec[0];
  }

  get length(): number {
    return 1; // Only one component for numeric encoding
  }
}

export default NumericEncoder;
