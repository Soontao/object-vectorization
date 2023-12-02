import { randomUUID } from "crypto";
import { UUIDEncoder } from "../src/encoders/UUIDEncoder";

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


});
