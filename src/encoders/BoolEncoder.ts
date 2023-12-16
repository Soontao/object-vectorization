import CategoryEncoder from "./CategoryEncoder.js";
import { Property } from "./Metadata.js";

/**
 * @human
 */
export class BoolEncoder extends CategoryEncoder<boolean> {
  constructor(prop: Property) {
    super({ ...prop, values: [true, false] });
  }
}

export default BoolEncoder;
