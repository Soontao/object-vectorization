import { StatisticListEncoder } from "../src/encoders/StatisticListEncoder.js";

describe("StatisticListEncoder Test Suite", () => {

  const meta = {
    properties: [
      { name: "age", type: "numeric" },
      { name: "height", type: "numeric" },
    ],
  };

  const encoder = new StatisticListEncoder(meta);

  const testData = [
    { age: 25, height: 180 },
    { age: 30, height: 175 },
    { age: 35, height: 185 },
  ];

  it("should encode correctly", () => {
    const encoded = encoder.encode(testData);
    const features = encoder.features("list_a")
    // Check if the encoded vector has the correct length
    expect(encoded.length).toBe(10);
    expect(features).toMatchSnapshot()
  });

  it("should return features correctly", () => {
    const features = encoder.features("age");

    expect(features).toBeTruthy();
    expect(features.length).toBe(10);
  });


});
