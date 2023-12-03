/* eslint-disable @typescript-eslint/indent */
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

// TODO: object metadata validator
export interface ObjectMetadata {
  properties: Array<Property>;
  _encoder_filled?: boolean;
  _sorted?: boolean;
  _length?: number;
}

export default ObjectMetadata;
