import { AbstractEncoder } from "./Encoder.js";
import { isNull, nullVector } from "./util.js";

export class UUIDEncoder extends AbstractEncoder<string> {
  /**
   *
   * @param hexString
   * @returns
   */
  #hexToUint32Array(hexString: string) {
    const buffer = Buffer.from(hexString, "hex");

    const numElements = Math.ceil(buffer.length / Uint32Array.BYTES_PER_ELEMENT);

    return Array.from(new Uint32Array(buffer.buffer, buffer.byteOffset, numElements));
  }

  #Uint32ArrayToHex(arr: Array<number>) {
    return Buffer.from(new Uint32Array(arr).buffer).toString("hex");
  }

  features(): string[] {
    return Array(4)
      .fill(0)
      .map((_, idx) => `${this._property.name}_${idx + 1}`);
  }

  encode(value: string): number[] {
    if (isNull(value)) {
      return nullVector(this.length);
    }
    value = value.replaceAll("-", "");
    return this.withFeatures(this.#hexToUint32Array(value));
  }

  decode(vec: number[]): string {
    const hex = this.#Uint32ArrayToHex(vec);
    return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join("-");
  }

  get length(): number {
    return 4;
  }
}

export default UUIDEncoder;
