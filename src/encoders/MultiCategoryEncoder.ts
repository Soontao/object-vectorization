import CategoryEncoder from "./CategoryEncoder.js";

/**
 * @human
 */
export class MultiCategoryEncoder<T> extends CategoryEncoder<Array<T>> {
  constructor(values: Array<any>) {
    super(values, true);
  }

  features(name: string): string[] {
    return this._values.map((v) => `${name}_has_${String(v)}`);
  }
}

export default MultiCategoryEncoder;
