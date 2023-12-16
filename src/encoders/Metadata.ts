/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/indent */
import { Schema, validator } from "@exodus/schemasafe";
import BoolEncoder from "./BoolEncoder.js";
import CategoryEncoder from "./CategoryEncoder.js";
import DateTimeEncoder from "./DateTimeEncoder.js";
import Encoder from "./Encoder.js";
import FixedListEncoder from "./FixedListEncoder.js";
import MultiCategoryEncoder from "./MultiCategoryEncoder.js";
import MurmurEncoder from "./MurmurEncoder.js";
import NumericEncoder from "./NumericEncoder.js";
import ObjectEncoder from "./ObjectEncoder.js";
import StatisticListEncoder from "./StatisticListEncoder.js";
import UUIDEncoder from "./UUIDEncoder.js";

export interface Property {
  /**
   * name of property
   */
  name: string;
  /**
   * type
   */
  type:
    | "category"
    | "murmur_hash"
    | "multi_category"
    | "bool"
    | "uuid"
    | "numeric"
    | "datetime"
    | "object"
    | "fixed_object_list"
    | "statistic_object_list";

  /**
   * possible values for category
   */
  values?: Array<any>;

  /**
   * metadata for object
   */
  meta?: ObjectMetadata;

  /**
   * only for fixed_object_list, used to match input list item, then assign to correct position
   */
  position_dict?: Array<any>;

  /**
   * only for hash encoders like murmur_hash
   */
  hash_seed?: number;

  /**
   * internal _encoder
   */
  _encoder?: Encoder;
}

export interface ObjectMetadata {
  properties: Array<Property>;
  readonly _encoder_filled?: boolean;
  readonly _sorted?: boolean;
  readonly _length?: number;
  readonly _valid?: boolean;
}

const metadataSchema: Schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    Property: {
      type: "object",
      properties: {
        name: { type: "string" },
        type: {
          type: "string",
          enum: [
            "category",
            "murmur_hash",
            "multi_category",
            "bool",
            "uuid",
            "numeric",
            "datetime",
            "object",
            "fixed_object_list",
            "statistic_object_list",
          ],
        },
        values: {
          type: "array",
          minItems: 1,
          items: { type: ["string", "number", "boolean", "null"] },
        },
        meta: { $ref: "#/definitions/ObjectMetadata" },
        position_dict: { type: "array" },
        hash_seed: { type: "number" },
      },
      required: ["name", "type"],
      if: {
        properties: { type: { const: ["category", "multi_category"] } },
      },
      then: {
        required: ["values"],
      },
      else: {
        if: {
          properties: {
            type: { const: "object" },
          },
        },
        then: {
          required: ["meta"],
        },
        else: {
          if: {
            properties: {
              type: { const: "fixed_object_list" },
            },
          },
          then: {
            required: ["position_dict", "meta"],
          },
        },
      },
    },
    ObjectMetadata: {
      type: "object",
      properties: {
        properties: {
          type: "array",
          minItems: 1,
          items: { $ref: "#/definitions/Property" },
        },
      },
      required: ["properties"],
    },
  },
  type: "object",
  properties: {
    properties: {
      type: "array",
      minItems: 1,
      items: { $ref: "#/definitions/Property" },
    },
  },
  required: ["properties"],
};

export function mapEncoder(property: Property) {
  switch (property.type) {
    case "bool":
      return new BoolEncoder(property);
    case "category":
      return new CategoryEncoder(property);
    case "multi_category":
      return new MultiCategoryEncoder(property);
    case "datetime":
      return new DateTimeEncoder(property);
    case "numeric":
      return new NumericEncoder(property);
    case "object":
      return new ObjectEncoder(property);
    case "uuid":
      return new UUIDEncoder(property);
    case "fixed_object_list":
      return new FixedListEncoder(property);
    case "statistic_object_list":
      return new StatisticListEncoder(property);
    case "murmur_hash":
      return new MurmurEncoder(property);
    default:
      throw new TypeError(`cannot handle type ${property.type} for ${property.name}`);
  }
}

export function createObjectMetadata(objectMetadata: ObjectMetadata) {
  return objectMetadata;
}

export const metadataValidator = validator(metadataSchema, { includeErrors: true });

export default ObjectMetadata;
