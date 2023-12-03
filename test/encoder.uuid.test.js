import { randomUUID } from "crypto";
import { UUIDEncoder } from "../src/encoders/UUIDEncoder.js";

describe('UUIDEncoder Test Suite', () => {

  it('should support UUID encoder', () => {
    const e = new UUIDEncoder()
    const u = randomUUID()
    const vec = e.encode(u)

    expect(vec).toHaveLength(4)
    expect(e.decode(vec)).toEqual(u)

  });

  it('should support UUID encoder with snapshot test', () => {
    const e = new UUIDEncoder()
    const v = e.encode('d59a5c43-2e7a-445e-ac3c-b4ed862da041')
    expect(v).toMatchSnapshot()
    expect(e.decode(v)).toMatchSnapshot()
  });

  // AI
  it("encodes and decodes a valid UUID", () => {
    const encoder = new UUIDEncoder();
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const encodedValue = encoder.encode(uuid);
    const decodedValue = encoder.decode(encodedValue);
    expect(decodedValue).toBe(uuid);
  });

  it("encodes and decodes an empty UUID", () => {
    const encoder = new UUIDEncoder();
    const emptyUUID = "00000000-0000-0000-0000-000000000000";
    const encodedEmptyUUID = encoder.encode(emptyUUID);
    const decodedEmptyUUID = encoder.decode(encodedEmptyUUID);
    expect(decodedEmptyUUID).toBe(emptyUUID);
  });

  it("should encode a UUID string to a Uint32Array", () => {
    const encoder = new UUIDEncoder();
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const expectedArray = [
      8654421,
      3561069538,
      1715738279,
      17493,
    ];

    const result = encoder.encode(uuid);

    expect(result).toEqual(expectedArray);
  });

  it("should decode a Uint32Array to a UUID string", () => {
    const encoder = new UUIDEncoder();
    const uuid = "58319155-6b94-0000-3442-000052410000";
    const inputArray = [
      1435578712, 37995, 16948, 16722,
    ];

    const result = encoder.decode(inputArray);

    expect(result).toEqual(uuid);
  });

  it("should return an array with the given name in features", () => {
    const encoder = new UUIDEncoder();
    const name = "myUUID";
    const result = encoder.features(name);

    expect(result).toHaveLength(4);
    expect(result).toMatchSnapshot();
  });

  it("should return the correct length of the encoded array", () => {
    const encoder = new UUIDEncoder();
    const result = encoder.length;

    expect(result).toEqual(4);
  });

});
