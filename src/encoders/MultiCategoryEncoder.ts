import CategoryEncoder from "./CategoryEncoder.js";

/**
 * MultiCategoryEncoder
 *
 * @human
 */
export class MultiCategoryEncoder<T> extends CategoryEncoder<Array<T>> {
  features(): string[] {
    return this._values.map((v) => `${this._property.name}_has_${String(v)}`);
  }
}

export default MultiCategoryEncoder;
