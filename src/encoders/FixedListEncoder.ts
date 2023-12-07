import Encoder from "./Encoder.js";
import ObjectMetadata from "./Metadata.js";
import ObjectEncoder, { sortMetaAndFillEncoders } from "./ObjectEncoder.js";
import { Vector } from "./type.js";
import { isNull, isNullVector, nullVector } from "./util.js";

export function match<T = any>(obj: T, part: any): part is Partial<T> {
  return Object.entries(part)?.every?.(([p, v]) => (obj as any)?.[p] === v);
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
      if (isNull(partialItem)) {
        encodedVector.push(...nullVector(this.#objectEncoder.length));
        continue;
      }
      const item = value.find((obj) => match(obj, partialItem));
      if (item == undefined) {
        encodedVector.push(...nullVector(this.#objectEncoder.length));
      } else {
        encodedVector.push(...this.#objectEncoder.encode(item!));
      }
    }

    return encodedVector;
  }

  decode(vec: Vector): T[] {
    if (vec.length !== this.length) {
      throw new Error("FixedListEncoder: Invalid vector length");
    }
    if (isNullVector(vec)) {
      return [];
    }

    const decodedList: T[] = [];

    for (let i = 0; i < this.#positionDict.length; i++) {
      const startIndex = i * this.#objectEncoder.length;
      const endIndex = startIndex + this.#objectEncoder.length;

      const itemVector = vec.slice(startIndex, endIndex);

      // Check wether sub item is full null value vector
      if (isNullVector(itemVector)) {
        decodedList.push(null as any);
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

export default FixedListEncoder;
