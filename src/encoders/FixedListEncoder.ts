import { Vector } from "../type";
import Encoder from "./Encoder";
import ObjectMetadata from "./Metadata";
import ObjectEncoder, { sortMetaAndFillEncoders } from "./ObjectEncoder";

export function match<T = any>(obj: T, part: any): part is Partial<T> {
  return Object.entries(part).every(([p, v]) => (obj as any)[p] === v);
}

/**
 * @human (+)
 * @ai (-)
 */
export class FixedListEncoder<T = any> implements Encoder<Array<T>> {
  #meta: ObjectMetadata;

  #objectEncoder: ObjectEncoder<T>;

  #length: number;

  #positionDict: Partial<T>[];

  /**
   *
   * @param meta metadata of item of list
   * @param fixedLength fixed length of list, means the max items
   * @param positionDict
   */
  constructor(meta: ObjectMetadata, positionDict: Array<Partial<T>>) {
    this.#meta = sortMetaAndFillEncoders(meta);
    this.#objectEncoder = new ObjectEncoder(this.#meta);
    this.#length = positionDict.length * this.#objectEncoder.length;
    this.#positionDict = positionDict;
  }

  features(name: string = "root"): string[] {
    return this.#positionDict.map((_, idx) => this.#objectEncoder.features(`${name}_${idx}`)).flat();
  }

  encode(value: T[]): Vector {
    const encodedVector: number[] = new Array(0);

    for (const partialItem of this.#positionDict) {
      const item = value.find((obj) => match(obj, partialItem));
      if (!item) {
        encodedVector.push(...new Array(this.#objectEncoder.length).fill(NaN));
      } else {
        const itemVector = this.#objectEncoder.encode(item!);
        encodedVector.push(...itemVector);
      }
    }

    return encodedVector;
  }

  decode(vec: Vector): T[] {
    if (vec.length !== this.length) {
      throw new Error("FixedListEncoder: Invalid vector length");
    }

    const decodedList: T[] = [];

    for (let i = 0; i < this.#positionDict.length; i++) {
      const startIndex = i * this.#objectEncoder.length;
      const endIndex = startIndex + this.#objectEncoder.length;

      const itemVector = vec.slice(startIndex, endIndex);

      // Check if all values in the itemVector are NaN
      if (itemVector.every((val) => isNaN(val))) {
        // do nothing
      } else {
        const decodedItem = this.#objectEncoder.decode(itemVector);
        decodedList.push(decodedItem);
      }
    }

    return decodedList;
  }

  get length(): number {
    return this.#length;
  }
}
