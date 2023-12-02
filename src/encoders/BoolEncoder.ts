import CategoryEncoder from "./CategoryEncoder";

/**
 * @human
 */
export class BoolEncoder extends CategoryEncoder<boolean> {
  constructor() {
    super([true, false]);
  }
}

export default BoolEncoder;
