/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/indent */
import { Schema, validator } from "@exodus/schemasafe";
import Encoder from "./Encoder.js";

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
      },
      required: ["name", "type"],
      if: {
        properties: { type: { const: "category" } },
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

export const metadataValidator = validator(metadataSchema, { includeErrors: true });

export default ObjectMetadata;
