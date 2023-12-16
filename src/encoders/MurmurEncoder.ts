import { murmurhash3 } from "../utils/murmurhash3.js";
import { AbstractEncoder } from "./Encoder.js";
import { Property } from "./Metadata.js";
import { Vector } from "./type.js";
import { isNull, isNullVector, nullVector } from "./util.js";

/**
 * in most case, use this for semantic code
 *
 * @ai
 * @human
 */
export class MurmurEncoder extends AbstractEncoder<string> {
  #seed: number;

  constructor(prop: Property) {
    super(prop);
    this.#seed = prop.hash_seed!;
  }

  encode(value: string): Vector {
    if (isNull(value)) {
      return nullVector(this.length);
    }
    return this.withFeatures([murmurhash3(String(value), this.#seed)]);
  }

  decode(_vec: Vector): string {
    if (isNullVector(_vec)) {
      return null as any;
    }
    throw new Error("Decoding is not implemented for MurmurEncoder.");
  }

  features(): Array<string> {
    return [this._property.name];
  }

  get length(): number {
    return 1;
  }
}

export default MurmurEncoder;
