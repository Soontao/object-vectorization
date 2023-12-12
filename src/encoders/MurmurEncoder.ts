import { murmurhash3 } from "../utils/murmurhash3.js";
import Encoder from "./Encoder.js";
import { Vector } from "./type.js";
import { isNull, isNullVector, nullVector } from "./util.js";

/**
 * in most case, use this for semantic code
 *
 * @ai
 * @human
 */
export class MurmurEncoder implements Encoder<string> {
  #seed: number;

  constructor(seed: number = 42) {
    this.#seed = seed;
  }

  encode(value: string): Vector {
    if (isNull(value)) {
      return nullVector(this.length);
    }
    return [murmurhash3(String(value), this.#seed)];
  }

  decode(_vec: Vector): string {
    if (isNullVector(_vec)) {
      return null as any;
    }
    throw new Error("Decoding is not implemented for MurmurEncoder.");
  }

  features(name: string): Array<string> {
    return [name];
  }

  get length(): number {
    return 1;
  }
}

export default MurmurEncoder;
