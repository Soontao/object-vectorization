import { Encoder } from "./Encoder.js";

/**
 * @human
 */
export class CategoryEncoder<T = any> implements Encoder<T> {
  protected _values: any[];

  _valueIndex: Map<T, number>;

  _multi: boolean;

  constructor(values: Array<T>, multi = false) {
    this._values = values;
    this._valueIndex = new Map();
    this._multi = multi;
    for (const [index, value] of values.entries()) {
      this._valueIndex.set(value, index);
    }
  }

  features(name: string): string[] {
    return this._values.map((v) => `${name}_is_${String(v)}`);
  }

  encode(value: T): Array<number> {
    const vec = new Array(this.length).fill(0);
    if (value == undefined || (value instanceof Array && value.length == 0)) {
      return vec;
    }
    const values: Array<T> = value instanceof Array ? value : [value];
    for (const singleValue of values) {
      const index = this._valueIndex.get(singleValue);
      if (index !== undefined) vec[index] = 1;
    }
    return vec;
  }

  decode(vec: Array<number>) {
    if (vec.length !== this.length) {
      throw new Error("Invalid vector length");
    }
    if (this._multi) {
      const values = [];
      for (const [idx, value] of vec.entries()) {
        if (value == 1) {
          values.push(this._values.at(idx));
        }
      }
      return values;
    } else {
      const index = vec.findIndex((v) => v === 1);
      if (index < 0) {
        return undefined;
      }
      return this._values.at(index);
    }
  }

  get length() {
    return this._values.length;
  }
}

export default CategoryEncoder;
