/* eslint-disable camelcase */
import { Vector } from "../type";
import BoolEncoder from "./BoolEncoder";
import CategoryEncoder from "./CategoryEncoder";
import DateTimeEncoder from "./DateTimeEncode";
import Encoder from "./Encoder";
import { FixedListEncoder } from "./FixedListEncoder";
import ObjectMetadata from "./Metadata";
import NumericEncoder from "./NumericEncoder";

export function sort(meta: ObjectMetadata): ObjectMetadata {
  if (meta._sorted) {
    return meta;
  }
  const newMeta = { ...meta, _sorted: true };
  newMeta.properties = meta.properties
    .map((v) => {
      if (v.type == "object") {
        const newV = { ...v };
        newV.meta = sort(v.meta as any);
        return newV;
      }
      if (v.type === "category" && v.values) {
        v.values = v.values!.sort();
      }
      return v;
    })
    .sort((p1, p2) => (p1.name > p2.name ? 1 : -1));
  return newMeta;
}

export function fillEncoders(meta: ObjectMetadata) {
  if (meta._encoder_filled) {
    return;
  }
  for (const property of meta.properties) {
    if (property._encoder !== undefined) {
      continue;
    }
    if (property.meta) {
      fillEncoders(property.meta!); // inner meta create encoders firstly
    }
    switch (property.type) {
      case "bool":
        property._encoder = new BoolEncoder();
        break;
      case "category":
        property._encoder = new CategoryEncoder(property.values as Array<any>);
        break;
      case "datetime":
        property._encoder = new DateTimeEncoder();
        break;
      case "numeric":
        property._encoder = new NumericEncoder();
        break;
      case "object":
        property._encoder = new ObjectEncoder(property.meta!);
        break;
      case "object_list":
        property._encoder = new FixedListEncoder(property.meta!, property.position_dict!);
        break;
      default:
        throw new TypeError(`cannot handle type ${property.type} for ${property.name}`);
    }
  }
  meta._encoder_filled = true;
}

/**
 * @ai
 * @human
 */
export class ObjectEncoder<T> implements Encoder<T> {
  #meta: ObjectMetadata;

  #length: number;

  constructor(meta: ObjectMetadata) {
    this.#meta = sort(meta);
    fillEncoders(this.#meta);
    this.#length = this._calculateLength();
  }

  private _calculateLength(): number {
    return this.#meta.properties.reduce((acc, property) => acc + property._encoder!.length, 0);
  }

  encode(value: T): Vector {
    if (typeof value !== "object" || value === null) {
      throw new Error("Invalid value. Expected an object.");
    }

    const encodedVector: number[] = [];

    for (const property of this.#meta.properties) {
      encodedVector.push(...property._encoder!.encode((value as any)[property.name]));
    }

    return encodedVector;
  }

  decode(vec: Vector): T {
    if (vec.length !== this.#length) {
      throw new Error("Invalid vector length");
    }

    const decodedObject: any = {};
    let index = 0;

    for (const property of this.#meta.properties) {
      const encoder = property._encoder!;
      const value = encoder.decode(vec.slice(index, index + encoder.length));
      decodedObject[property.name] = value;
      index += property._encoder!.length;
    }

    return decodedObject as T;
  }

  get length(): number {
    return this.#length;
  }
}

export default ObjectEncoder;
