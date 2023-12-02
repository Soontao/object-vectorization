// TODO: handle null value

import { Encoder } from "./Encoder";

export class CategoryEncoder<T = any> implements Encoder<T> {
  #values: any[];

  #valueIndex: Map<T, number>;

  constructor(values: Array<T>) {
    this.#values = values;
    this.#valueIndex = new Map();
    for (const [index, value] of values.entries()) {
      this.#valueIndex.set(value, index);
    }
  }

  encode(value: T): Float32Array {
    const vec = new Float32Array(this.length);
    const index = this.#valueIndex.get(value);
    vec.fill(0);
    if (index) vec[index] = 1;
    return vec;
  }

  decode(vec: Float32Array) {
    return this.#values.at(vec.findIndex((v) => v == 1));
  }

  get length() {
    return this.#values.length;
  }
}

export default CategoryEncoder;
