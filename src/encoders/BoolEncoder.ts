import CategoryEncoder from "./CategoryEncoder.js";

/**
 * @human
 */
export class BoolEncoder extends CategoryEncoder<boolean> {
  constructor() {
    super([true, false]);
  }
}

export default BoolEncoder;
