import defineHiddenProperty from "../utils/defineHiddenProperty.js";
import ObjectMetadata, { Property } from "./Metadata.js";
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
   */
  features(): Array<string>;
  /**
   * vector length
   */
  get length(): number;
}

export abstract class AbstractEncoder<T> implements Encoder<T> {
  protected _property: Property;

  constructor(property: Property | ObjectMetadata) {
    if (!("name" in property) && "properties" in property) {
      this._property = { name: "root", meta: property } as any;
    } else {
      this._property = property;
    }
  }

  protected withFeatures(vec: Vector) {
    return defineHiddenProperty(vec, "features", this.features(), true);
  }

  abstract encode(value: T): Vector;

  abstract decode(vec: Vector): T;

  abstract features(): string[];

  abstract get length(): number;
}

export default Encoder;
