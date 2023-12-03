/* eslint-disable camelcase */
import { inspect } from "util";
import BoolEncoder from "./BoolEncoder.js";
import CategoryEncoder from "./CategoryEncoder.js";
import DateTimeEncoder from "./DateTimeEncoder.js";
import Encoder from "./Encoder.js";
import FixedListEncoder from "./FixedListEncoder.js";
import ObjectMetadata, { metadataValidator } from "./Metadata.js";
import NumericEncoder from "./NumericEncoder.js";
import StatisticListEncoder from "./StatisticListEncoder.js";
import UUIDEncoder from "./UUIDEncoder.js";
import { Vector } from "./type.js";

export function sort(meta: ObjectMetadata): ObjectMetadata {
  if (meta._sorted) {
    return meta;
  }
  const newMeta = { ...meta };
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
  Object.defineProperty(newMeta, "_sorted", { value: true, enumerable: false });
  return newMeta;
}

export function fillEncoders(meta: ObjectMetadata) {
  if (meta._encoder_filled) {
    return meta;
  }
  for (const property of meta.properties) {
    if (property._encoder !== undefined) {
      continue;
    }
    if (property.meta) {
      sortMetaAndFillEncoders(property.meta!); // inner meta create encoders firstly
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
      case "uuid":
        property._encoder = new UUIDEncoder();
        break;
      case "fixed_object_list":
        property._encoder = new FixedListEncoder(property.meta!, property.position_dict!);
        break;
      case "statistic_object_list":
        property._encoder = new StatisticListEncoder(property.meta!);
        break;
      default:
        throw new TypeError(`cannot handle type ${property.type} for ${property.name}`);
    }
  }
  calculateObjectVecLength(meta);
  Object.defineProperty(meta, "_encoder_filled", { value: true, enumerable: false });
  return meta;
}

export function sortMetaAndFillEncoders(meta: ObjectMetadata): ObjectMetadata {
  if (meta._valid == undefined) {
    const isValid = metadataValidator(meta as any);
    if (!isValid) {
      throw new Error(`not valid metadata, please check ${inspect(metadataValidator.errors)}`);
    }
  }
  Object.defineProperty(meta, "_valid", { value: true, enumerable: false });
  return fillEncoders(sort(meta));
}

export function calculateObjectVecLength(meta: ObjectMetadata): number {
  if (meta._length) {
    return meta._length;
  }
  const _length = meta.properties.reduce((acc, property) => acc + property._encoder!.length, 0);
  Object.defineProperty(meta, "_length", { value: _length, enumerable: false });
  return _length;
}

/**
 * @ai
 * @human
 */
export class ObjectEncoder<T> implements Encoder<T> {
  #meta: ObjectMetadata;

  constructor(meta: ObjectMetadata) {
    this.#meta = sortMetaAndFillEncoders(meta);
  }

  features(name: string = "root"): string[] {
    return this.#meta.properties.map((p) => p._encoder!.features(p.name).map((pName) => `${name}_${pName}`)).flat();
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
    if (vec.length !== this.length) {
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
    return this.#meta._length!;
  }
}

export default ObjectEncoder;
