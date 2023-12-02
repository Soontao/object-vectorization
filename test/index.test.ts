import { ObjectEncoder, ObjectMetadata } from "../src";

describe("README Test Suite", () => {
  it("should proceed README 1st example", () => {
    // Define Object Metadata
    const simpleObjectMetadata: ObjectMetadata = {
      properties: [
        { name: "property1", type: "numeric" },
        { name: "property2", type: "category", values: ["value1", "value2", "value3"] },
      ],
    };

    // Create Object Encoder
    const encoder = new ObjectEncoder(simpleObjectMetadata);

    // Encode Simple Object
    const simpleObject = {
      property1: 42,
      property2: "value2",
      // Add more properties as needed
    };

    const encodedVector = encoder.encode(simpleObject);
    expect(encodedVector).toEqual([42, 0, 1, 0]);

    // You're able to get feature names from encoder
    expect(encoder.features()).toEqual([
      "root_property1",
      "root_property2_is_value1",
      "root_property2_is_value2",
      "root_property2_is_value3",
    ]);

    // Decode Vector to Object (if needed)
    const decodedObject = encoder.decode(encodedVector);
    expect(decodedObject).toMatchObject(simpleObject);
  });
});
