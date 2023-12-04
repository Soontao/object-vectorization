import { Encoder } from "./Encoder.js";
import { isNull, nullVector } from "./util.js";

export class UUIDEncoder implements Encoder<string> {
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

  features(name: string): string[] {
    return [`${name}_1`, `${name}_2`, `${name}_3`, `${name}_4`];
  }

  encode(value: string): number[] {
    if (isNull(value)) {
      return nullVector(this.length);
    }
    value = value.replaceAll("-", "");
    return this.#hexToUint32Array(value);
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
