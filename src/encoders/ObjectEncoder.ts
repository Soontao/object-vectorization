/* eslint-disable camelcase */
import { inspect } from "util";
import Encoder from "./Encoder.js";
import ObjectMetadata, { mapEncoder, metadataValidator } from "./Metadata.js";
import { Vector } from "./type.js";
import { isNull, nullVector } from "./util.js";

export function sort(meta: ObjectMetadata): ObjectMetadata {
  if (meta._sorted) {
    return meta;
  }
  const newMeta = { ...meta };
  newMeta.properties = meta.properties
    .map((property) => {
      if (property.type == "object") {
        const newV = { ...property };
        newV.meta = sort(property.meta as any);
        return newV;
      }
      if (property.type === "category" && property.values) {
        property.values = property.values!.sort();
      }
      return property;
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
    Object.defineProperty(property, "_encoder", { value: mapEncoder(property), enumerable: false });
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
    if (typeof value !== "object") {
      throw new Error("Invalid value. Expected an object.");
    }

    if (isNull(value)) {
      return nullVector(this.length);
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
