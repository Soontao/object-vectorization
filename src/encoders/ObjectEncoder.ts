/* eslint-disable camelcase */
import { inspect } from "util";
import defineHiddenProperty from "../utils/defineHiddenProperty.js";
import { AbstractEncoder } from "./Encoder.js";
import ObjectMetadata, { Property, mapEncoder, metadataValidator } from "./Metadata.js";
import { Vector } from "./type.js";
import { isNull, nullVector } from "./util.js";

export function sort(meta: ObjectMetadata): ObjectMetadata {
  if (meta._sorted) {
    return meta;
  }
  const newMeta = {
    ...meta,
    properties: meta.properties
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
      .sort((p1, p2) => (p1.name > p2.name ? 1 : -1)),
  };

  defineHiddenProperty(newMeta, "_sorted", true);
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
    defineHiddenProperty(property, "_encoder", mapEncoder(property));
  }
  calculateObjectVecLength(meta);
  defineHiddenProperty(meta, "_encoder_filled", true);
  return meta;
}

export function sortMetaAndFillEncoders(meta: ObjectMetadata): ObjectMetadata {
  if (meta._valid == undefined) {
    const isValid = metadataValidator(meta as any);
    if (!isValid) {
      throw new Error(`not valid metadata, please check ${inspect(metadataValidator.errors)}`);
    }
  }
  defineHiddenProperty(meta, "_valid", true);
  return fillEncoders(sort(meta));
}

export function calculateObjectVecLength(meta: ObjectMetadata): number {
  if (meta._length) {
    return meta._length;
  }
  const _length = meta.properties.reduce((acc, property) => acc + property._encoder!.length, 0);
  defineHiddenProperty(meta, "_length", _length);
  return _length;
}

/**
 * @ai
 * @human
 */
export class ObjectEncoder<T> extends AbstractEncoder<T> {
  protected _meta: ObjectMetadata;

  constructor(prop: Property | ObjectMetadata) {
    super(prop);
    this._meta = sortMetaAndFillEncoders(this._property.meta!);
  }

  features(): string[] {
    const name = this._property.name ?? "root";
    return this._meta.properties.map((p) => p._encoder!.features().map((pName) => `${name}_${pName}`)).flat();
  }

  encode(value: T): Vector {
    if (typeof value !== "object") {
      throw new Error("Invalid value. Expected an object.");
    }

    if (isNull(value)) {
      return nullVector(this.length);
    }

    const encodedVector: number[] = [];

    for (const property of this._meta.properties) {
      encodedVector.push(...property._encoder!.encode((value as any)[property.name]));
    }

    return this.withFeatures(encodedVector);
  }

  decode(vec: Vector): T {
    if (vec.length !== this.length) {
      throw new Error("Invalid vector length");
    }

    const decodedObject: any = {};
    let index = 0;

    for (const property of this._meta.properties) {
      const encoder = property._encoder!;
      const value = encoder.decode(vec.slice(index, index + encoder.length));
      decodedObject[property.name] = value;
      index += property._encoder!.length;
    }

    return decodedObject as T;
  }

  get length(): number {
    return this._meta._length!;
  }
}

export class ListObjectEncoder<T> extends ObjectEncoder<T> {
  features(): string[] {
    return this._meta.properties.map((p) => p._encoder!.features()).flat();
  }
}

export default ObjectEncoder;
