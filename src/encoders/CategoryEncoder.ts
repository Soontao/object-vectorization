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

  encode(value: T): Array<number> {
    if (value == undefined) {
      return new Array(this.length).fill(NaN);
    }
    const vec = new Array(this.length).fill(0);
    const index = this.#valueIndex.get(value);
    if (index !== undefined) vec[index] = 1;
    return vec;
  }

  decode(vec: Array<number>) {
    if (vec.length !== this.length) {
      throw new Error("Invalid vector length");
    }
    const index = vec.findIndex((v) => v === 1);
    if (index < 0) {
      return undefined;
    }
    return this.#values.at(index);
  }

  get length() {
    return this.#values.length;
  }
}

export default CategoryEncoder;
