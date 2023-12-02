import CategoryEncoder from "./CategoryEncoder";

export class BoolEncoder extends CategoryEncoder<boolean> {
  constructor() {
    super([true, false]);
  }
}

export default BoolEncoder;
