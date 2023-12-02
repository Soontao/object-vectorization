import { Vector } from "../type";

export interface Encoder<T = any> {
  encode(value: T): Vector;
  decode(vec: Vector): T;
  get length(): number;
}

export default Encoder;
