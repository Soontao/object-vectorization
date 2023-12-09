import { randomUUID } from "crypto";
import { murmurhash3 } from "../src/utils/MurmurHash.js";
import { createProjectorValues, flattenObject } from "../src/utils/Projector.js";

describe("Utils Test Suite", () => {
  it("should return the correct hash value for a given key and seed", () => {
    expect(murmurhash3("Hello, MurmurHash!", 42)).toEqual(363275047);
    expect(murmurhash3("Jest is awesome!", 123)).toEqual(2017758788);
  });

  it("should return the same hash value for the same key and seed", () => {
    const key = "Test Key";
    const seed = 987;

    expect(murmurhash3(key, seed)).toBe(murmurhash3(key, seed));
  });

  it("should pass fuzzy test for murmurhash3", () => {
    for (const _ of Array(500).fill(0)) {
      const h = murmurhash3(randomUUID());
      expect(h).toBeGreaterThan(0);
      expect(h).toBeLessThan(2 ** 32 - 1);
    }
  });

  it('flattens a simple object', () => {
    const input = { a: 1, b: { c: 2 } };
    const expected = [
      { key: 'a', val: '1' },
      { key: 'b_c', val: '2' },
    ];

    const result = flattenObject(input);

    expect(result).toEqual(expected);
  });

  it('flattens an object with arrays', () => {
    const input = { a: { b: [{ c: 1 }, { c: 2 }] } };
    const expected = [
      { key: 'a_b_0_c', val: '1' },
      { key: 'a_b_1_c', val: '2' },
    ];

    const result = flattenObject(input);

    expect(result).toEqual(expected);
  });

  it('flattens an object with null values', () => {
    const input = { a: null, b: { c: 2 } };
    const expected = [
      { key: 'a', val: 'null' },
      { key: 'b_c', val: '2' },
    ];

    const result = flattenObject(input);

    expect(result).toEqual(expected);
  });

  it('creates projector values', () => {
    const meta = {
      properties: [
        {
          name: 'property1',
          type: 'category',
          values: ['value1', 'value2', 'value3']
        },
      ],
    };

    const items = [
      { property1: 'value1' },
      { property1: 'value2' },
    ];

    const result = createProjectorValues(meta, items);

    expect(result.tsv).toMatchSnapshot()
    expect(result.metaTsv).toMatchSnapshot();
  });
});
