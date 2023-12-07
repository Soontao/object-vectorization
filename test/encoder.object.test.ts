// @ai
// @human
import { ObjectMetadata } from "../src/encoders/Metadata.js";
import { ObjectEncoder, sort, sortMetaAndFillEncoders } from "../src/encoders/ObjectEncoder.js";

describe("ObjectEncoder Test Suite", () => {
  it("should sort properties alphabetically", () => {
    // Arrange
    const unsortedMeta: ObjectMetadata = {
      properties: [
        { name: "zeta", type: "category", values: ["A", "B"] },
        { name: "alpha", type: "numeric" },
        { name: "beta", type: "bool" },
      ],
    };

    // Act
    const sortedMeta = sort(unsortedMeta);

    // Assert
    const expectedSortedMeta: ObjectMetadata = {
      properties: [
        { name: "alpha", type: "numeric" },
        { name: "beta", type: "bool" },
        { name: "zeta", type: "category", values: ["A", "B"] },
      ],
    };

    expect(sortedMeta).toMatchObject(expectedSortedMeta);
  });

  it("should recursively sort properties within objects", () => {
    // Arrange
    const unsortedMeta: ObjectMetadata = {
      properties: [
        { name: "zeta", type: "category", values: ["A", "B"] },
        {
          name: "nested",
          type: "object",
          meta: {
            properties: [
              { name: "gamma", type: "numeric" },
              { name: "alpha", type: "bool" },
            ],
          },
        },
        { name: "alpha", type: "numeric" },
      ],
    };

    // Act
    const sortedMeta = sort(unsortedMeta);

    // Assert
    const expectedSortedMeta: ObjectMetadata = {
      properties: [
        { name: "alpha", type: "numeric" },
        {
          name: "nested",
          type: "object",
          meta: {
            properties: [
              { name: "alpha", type: "bool" },
              { name: "gamma", type: "numeric" },
            ],
          },
        },
        { name: "zeta", type: "category", values: ["A", "B"] },
      ],
    };

    expect(sortedMeta).toMatchObject(expectedSortedMeta);
  });

  it("should sort category values alphabetically", () => {
    // Arrange
    const unsortedMeta: ObjectMetadata = {
      properties: [
        { name: "alpha", type: "category", values: ["C", "B", "A"] },
        { name: "beta", type: "category", values: ["Z", "X", "Y"] },
        { name: "gamma", type: "numeric" },
      ],
    };

    // Act
    const sortedMeta = sort(unsortedMeta);

    // Assert
    const expectedSortedMeta: ObjectMetadata = {
      properties: [
        { name: "alpha", type: "category", values: ["A", "B", "C"] },
        { name: "beta", type: "category", values: ["X", "Y", "Z"] },
        { name: "gamma", type: "numeric" },
      ],
    };

    expect(sortedMeta).toMatchObject(expectedSortedMeta);
  });

  it("should encode and decode an object correctly", () => {
    // Sample metadata for testing
    const metadata: any = {
      properties: [
        { name: "prop_bool", type: "bool" },
        { name: "prop_category", type: "category", values: ["A", "B", "C"] },
        { name: "prop_datetime", type: "datetime" },
        { name: "prop_numeric", type: "numeric" },
        {
          name: "prop_object",
          type: "object",
          meta: {
            properties: [
              { name: "nested_bool", type: "bool" },
              { name: "nested_category", type: "category", values: ["X", "Y", "Z"] },
            ],
          },
        },
      ],
    };

    // Sample object data for testing
    const testData = {
      prop_bool: true,
      prop_category: "B",
      prop_datetime: "2023-01-01T12:30:00.000Z",
      prop_numeric: 42,
      prop_object: {
        nested_bool: false,
        nested_category: "Z",
      },
    };

    // Create an instance of ObjectEncoder
    const objectEncoder = new ObjectEncoder(metadata);

    expect(objectEncoder.length).toBe(18);

    // Encode the test data
    const encodedVector = objectEncoder.encode(testData);

    expect(encodedVector.length).toBe(objectEncoder.length);

    expect(encodedVector).toMatchSnapshot();

    // Decode the encoded vector
    const decodedObject = objectEncoder.decode(encodedVector);

    expect(decodedObject).toMatchSnapshot();

    // Assertions
    expect(decodedObject).toEqual(testData);
  });

  // @ai
  it("should encode and decode correctly with nested object and list object", () => {
    // Sample metadata for testing
    const metadata: any = {
      properties: [
        { name: "prop_bool", type: "bool" },
        { name: "prop_category", type: "category", values: ["A", "B", "C"] },
        { name: "prop_datetime", type: "datetime" },
        { name: "prop_numeric", type: "numeric" },
        {
          name: "prop_object",
          type: "object",
          meta: {
            properties: [
              { name: "nested_bool", type: "bool" },
              { name: "nested_category", type: "category", values: ["X", "Y", "Z"] },
              {
                name: "nested_list",
                type: "fixed_object_list",
                meta: {
                  properties: [
                    { name: "item_name", type: "category", values: ["Item1", "Item2", "Item3"] },
                    { name: "item_value", type: "numeric" },
                  ],
                },
                position_dict: [{ item_name: "Item1" }, { item_name: "Item2" }],
              },
            ],
          },
        },
      ],
    };

    // Sample object data for testing
    const testData = {
      prop_bool: true,
      prop_category: "B",
      prop_datetime: "2023-01-01T12:30:00.000Z",
      prop_numeric: 42,
      prop_object: {
        nested_bool: false,
        nested_category: "Z",
        nested_list: [
          { item_name: "Item1", item_value: 10 },
          { item_name: "Item2", item_value: 20 },
        ],
      },
    };

    // Create an instance of ObjectEncoder
    const objectEncoder = new ObjectEncoder(metadata);
    const features = objectEncoder.features();

    expect(features).toMatchSnapshot();

    // Encode the test data
    const encodedVector = objectEncoder.encode(testData);

    expect(encodedVector).toHaveLength(features.length);
    expect(encodedVector).toMatchSnapshot();

    // Decode the encoded vector
    const decodedObject = objectEncoder.decode(encodedVector);

    // Assertions
    expect(decodedObject).toEqual(testData);
  });

  it("should encode and decode correctly with nested object and list object", () => {
    // Sample metadata for testing
    const metadata: ObjectMetadata = {
      properties: [
        { name: "object_code", type: "murmur_hash" },
        { name: "prop_bool", type: "bool" },
        { name: "prop_category", type: "category", values: ["A", "B", "C"] },
        { name: "prop_datetime", type: "datetime" },
        { name: "prop_numeric", type: "numeric" },
        {
          name: "prop_object",
          type: "object",
          meta: {
            properties: [
              { name: "nested_bool", type: "bool" },
              { name: "nested_category", type: "category", values: ["X", "Y", "Z"] },
              {
                name: "nested_list",
                type: "statistic_object_list", // Use the new type
                meta: {
                  properties: [
                    { name: "item_name", type: "category", values: ["Item1", "Item2", "Item3"] },
                    { name: "item_value", type: "numeric" },
                  ],
                },
                position_dict: [{ item_name: "Item1" }, { item_name: "Item2" }],
              },
            ],
          },
        },
      ],
    };

    // Sample object data for testing
    const testData = {
      object_code: "T_001",
      prop_bool: true,
      prop_category: "B",
      prop_datetime: "2023-01-01T12:30:00.000Z",
      prop_numeric: 42,
      prop_object: {
        nested_bool: false,
        nested_category: "Z",
        nested_list: [
          { item_name: "Item1", item_value: 10 },
          { item_name: "Item2", item_value: 20 },
        ],
      },
    };

    // Create an instance of ObjectEncoder
    const objectEncoder = new ObjectEncoder(metadata);
    const features = objectEncoder.features();

    expect(features).toMatchSnapshot();

    // Encode the test data
    const encodedVector = objectEncoder.encode(testData);

    expect(encodedVector).toHaveLength(features.length);
    expect(encodedVector).toMatchSnapshot();
  });

  it("Throws error for invalid ObjectMetadata", () => {
    const invalidObjectMetadata = {
      // Missing required properties field
      _encoder_filled: true,
      _sorted: false,
      _length: 5,
    };

    expect(() => sortMetaAndFillEncoders(invalidObjectMetadata as any)).toThrowErrorMatchingSnapshot();
  });
});
