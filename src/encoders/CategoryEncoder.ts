import { AbstractEncoder } from "./Encoder.js";
import { Property } from "./Metadata.js";
import { isNull, isNullVector, nullVector } from "./util.js";

const POSITIVE_VALUE = 1;
const NEGATIVE_VALUE = 0;

/**
 * @human
 */
export class CategoryEncoder<T = any> extends AbstractEncoder<T> {
  protected _values: any[];

  _valueIndex: Map<T, number>;

  _multi: boolean;

  constructor(prop: Property) {
    super(prop);
    this._values = prop.values!;
    this._valueIndex = new Map();
    this._multi = prop.type === "multi_category";
    for (const [index, value] of this._values.entries()) {
      this._valueIndex.set(value, index);
    }
  }

  features(): string[] {
    return this._values.map((v) => `${this._property.name}_is_${String(v)}`);
  }

  encode(value: T): Array<number> {
    if (isNull(value)) {
      return nullVector(this.length);
    }
    const vec = new Array(this.length).fill(NEGATIVE_VALUE);
    if (value == undefined || (this._multi && (value as Array<any>).length == 0)) {
      return vec;
    }
    const values: Array<T> = value instanceof Array ? value : [value];
    for (const singleValue of values) {
      const index = this._valueIndex.get(singleValue);
      if (index !== undefined) vec[index] = POSITIVE_VALUE;
    }
    return vec;
  }

  decode(vec: Array<number>) {
    if (vec.length !== this.length) {
      throw new Error("Invalid vector length");
    }
    if (isNullVector(vec)) {
      return null as any;
    }
    if (this._multi) {
      const values = [];
      for (const [idx, value] of vec.entries()) {
        if (value == POSITIVE_VALUE) {
          values.push(this._values.at(idx));
        }
      }
      return values;
    } else {
      const index = vec.findIndex((v) => v === POSITIVE_VALUE);
      if (index < 0) {
        return null;
      }
      return this._values.at(index);
    }
  }

  get length() {
    return this._values.length;
  }
}

export default CategoryEncoder;
