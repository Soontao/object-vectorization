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
    expect(encoded.length).toBe(12);
    expect(features).toMatchSnapshot()
  });

  it("should return features correctly", () => {
    const features = encoder.features("age");

    expect(features).toBeTruthy();
    expect(features.length).toBe(12);
  });


});

// >> AI Test Cases

// Mock metadata for product information
const productMeta = {
  properties: [
    { name: "id", type: "numeric" },
    { name: "price", type: "numeric" },
    { name: "quantity", type: "numeric" },
  ],
};

// Mock data for product information
const products = [
  { id: 1, price: 1200, quantity: 5 },
  { id: 2, price: 800, quantity: 10 },
  { id: 3, price: 100, quantity: 20 },
];

// Mock metadata for statistics on product prices
const statisticsMeta = {
  properties: [
    { name: "price_max", type: "numeric" },
    { name: "price_min", type: "numeric" },
    { name: "price_avg", type: "numeric" },
  ],
};

describe("StatisticListEncoder", () => {
  let statisticListEncoder = new StatisticListEncoder(productMeta);

  test("features method should return an array of strings", () => {
    const features = statisticListEncoder.features();
    expect(Array.isArray(features)).toBe(true);
    expect(features.length).toBeGreaterThan(0);
    // Add more specific assertions based on your use case
  });

  test("encode method should return a vector with the correct length", () => {
    const encodedVector = statisticListEncoder.encode(products);
    expect(encodedVector).toBeInstanceOf(Array);
    expect(encodedVector.length).toBe(statisticListEncoder.length);
    // Add more specific assertions based on your use case
  });

  test("decode method should throw an error", () => {
    expect(() => statisticListEncoder.decode([])).toThrow("Method not supported.");
    // Add more specific assertions based on your use case
  });

});

describe("Integration with Statistics Metadata", () => {
  let statisticListEncoderWithStats = new StatisticListEncoder(statisticsMeta);

  test("features method should return an array of strings for statistics metadata", () => {
    const features = statisticListEncoderWithStats.features();
    expect(Array.isArray(features)).toBe(true);
    expect(features.length).toBe(statisticListEncoderWithStats.length);
    // Add more specific assertions based on your use case
  });

  test("encode method should return a vector with the correct length for statistics metadata", () => {
    const encodedVector = statisticListEncoderWithStats.encode(products);
    expect(encodedVector).toBeInstanceOf(Array);
    expect(encodedVector.length).toBe(statisticListEncoderWithStats.length);
  });

});
