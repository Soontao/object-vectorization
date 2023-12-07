import { murmurhash3 } from "../utils/MurmurHash.js";
import Encoder from "./Encoder.js";
import { Vector } from "./type.js";

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
    return [murmurhash3(value, this.#seed)];
  }

  decode(_vec: Vector): string {
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
