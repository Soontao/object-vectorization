import { Vector } from "./type.js";

/**
 * Encoder
 */
export interface Encoder<T = any> {
  /**
   * encode value into vector
   *
   * @param value
   */
  encode(value: T): Vector;
  /**
   * decode vector into plain value
   *
   * @param vec
   */
  decode(vec: Vector): T;
  /**
   * get sub features list
   *
   * @param name current feature name
   */
  features(name: string): Array<string>;
  /**
   * vector length
   */
  get length(): number;
}

export default Encoder;
