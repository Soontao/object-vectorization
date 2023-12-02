export interface Encoder<T = any> {
  encode(value: T): Float32Array;
  decode(index: Float32Array): T;
  get length(): number;
}
