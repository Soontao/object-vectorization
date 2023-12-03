import { Vector } from "./type.js";

export interface Encoder<T = any> {
  encode(value: T): Vector;
  decode(vec: Vector): T;
  features(name: string): Array<string>;
  get length(): number;
}

export default Encoder;
