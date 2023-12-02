import Encoder from "./Encoder";

export interface Property {
  /**
   * name of property
   */
  name: string;
  /**
   * type
   */
  type: "category" | "bool" | "numeric" | "datetime" | "object" | "object_list";

  /**
   * possible values for category
   */
  values?: Array<any>;

  /**
   * metadata for object
   */
  meta?: ObjectMetadata;

  /**
   * for object list, used to match list item then assign to correct position
   */
  position_dict?: Array<any>;

  /**
   * internal _encoder
   */
  _encoder?: Encoder;
}

export interface ObjectMetadata {
  properties: Array<Property>;
  _encoder_filled?: boolean;
  _sorted?: boolean;
}

export default ObjectMetadata;
