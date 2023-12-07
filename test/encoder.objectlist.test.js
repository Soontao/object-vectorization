// @human
// @ai
import { FixedListEncoder } from "../src/encoders/FixedListEncoder.js";
import { ObjectEncoder } from "../src/encoders/ObjectEncoder.js";
import { nullVector } from "../src/encoders/util.js";

describe("FixedListEncoder", () => {
  const meta = {
    properties: [
      { name: "name", type: "category", values: ["Alice", "Bob", "Charlie"] },
      { name: "age", type: "numeric" },
    ],
  };

  const positionDict = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
  ];

  const encoder = new FixedListEncoder(meta, positionDict);

  const testData = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 },
  ];

  it("should encode and decode correctly", () => {
    const encoded = encoder.encode(testData);
    expect(encoded).toMatchSnapshot();
    const decoded = encoder.decode(encoded);
    expect(decoded).toHaveLength(2);
    expect(decoded).toMatchSnapshot();
  });

  it("should encode with NaN for missing items", () => {
    const objEncoder = new ObjectEncoder(meta);
    const testDataSubset = [
      { name: "Alice", age: 25 },
      { name: "Charlie", age: 35 },
    ];

    const encoded = encoder.encode(testDataSubset);

    // Check if NaN values are present for the missing item
    expect(encoded).toEqual([
      // Encoded Alice
      ...objEncoder.encode({ name: "Alice", age: 25, length: 2 }),
      // Encoded Bob (missing)
      ...nullVector(objEncoder.length),
    ]);
  });

  it("should handle invalid vector length during decoding", () => {
    const invalidVector = [1, 2, 3, 4, 5];

    expect(() => encoder.decode(invalidVector)).toThrow("FixedListEncoder: Invalid vector length");
  });

  it("should handle decoding with NaN list", () => {
    const nanEncoded = nullVector(8);

    const decoded = encoder.decode(nanEncoded);

    // Check if the decoded list contains undefined for each item
    expect(decoded).toHaveLength(0);
  });

  it("should handle encoding and decoding an empty input list", () => {
    const emptyInputList = [];

    const encoded = encoder.encode(emptyInputList);
    const decoded = encoder.decode(encoded);

    // Check if the decoded list is empty
    expect(decoded).toHaveLength(0);
  });

  it("should handle encoding and decoding an empty input list", () => {
    const emptyInputList = [null, undefined, {}];

    const encoded = encoder.encode(emptyInputList);
    const decoded = encoder.decode(encoded);

    expect(decoded).toHaveLength(0);
  });

  it("should encode and decode correctly with nested object in list", () => {
    const meta = {
      properties: [
        { name: "name", type: "category", values: ["Alice", "Bob", "Charlie"] },
        { name: "age", type: "numeric" },
        {
          name: "details",
          type: "object",
          meta: {
            properties: [
              { name: "gender", type: "category", values: ["Male", "Female"] },
              { name: "city", type: "category", values: ["New York", "London"] },
            ],
          },
        },
      ],
    };

    const positionDict = [{ name: "Alice" }, { name: "Bob" }];

    const encoder = new FixedListEncoder(meta, positionDict);

    const testData = [
      { name: "Alice", age: 25, details: { gender: "Female", city: "New York" } },
      { name: "Bob", age: 30, details: { gender: "Male", city: "London" } },
      { name: "Charlie", age: 35, details: { gender: "Female", city: "Paris" } },
    ];
    const encoded = encoder.encode(testData);
    const features = encoder.features();
    expect(features).toMatchSnapshot();
    expect(encoded).toMatchSnapshot();
    expect(encoded).toHaveLength(features.length);

    const decoded = encoder.decode(encoded);
    expect(decoded).toHaveLength(2);
    expect(decoded).toMatchSnapshot();
  });
});
