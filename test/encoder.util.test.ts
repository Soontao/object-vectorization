// @ts-nocheck
import { faker } from "@faker-js/faker";
import { RandomForestClassifier } from "ml-random-forest";
import ObjectMetadata from "../src/encoders/Metadata.js";
import ObjectEncoder from "../src/encoders/ObjectEncoder.js";
import { Vector } from "../src/encoders/type.js";
import { generateRandomData as generate } from "./test.utils.js";

const mobilePhoneMeta: ObjectMetadata = {
  properties: [
    { name: "brand", type: "category", values: ["Apple", "Samsung", "Google", "Others"] },
    { name: "releaseDate", type: "datetime" },
    { name: "price", type: "numeric" },
    {
      name: "models",
      type: "fixed_object_list",
      meta: {
        properties: [
          { name: "modelName", type: "category", values: ["A", "B"] },
          { name: "modelPrice", type: "numeric" },
        ],
      },
      position_dict: [{ modelName: "A" }, { modelName: "B" }],
    },
    { name: "region", type: "category", values: ["North America", "Europe", "Asia", "Others"] },
    { name: "colorOptions", type: "category", values: ["Black", "White", "Silver", "Gold", "Others"] },
    { name: "displaySize", type: "numeric" },
    { name: "batteryCapacity", type: "numeric" },
    { name: "operatingSystem", type: "category", values: ["iOS", "Android", "Other"] },
    { name: "storageCapacity", type: "numeric" },
    { name: "cameraResolution", type: "numeric" },
    { name: "isWaterResistant", type: "bool" },
    { name: "hasHeadphoneJack", type: "bool" },
    { name: "processor", type: "category", values: ["Snapdragon", "Exynos", "A-series", "Other"] },
    { name: "RAM", type: "numeric" },
    { name: "is5GCapable", type: "bool" },
    { name: "weight", type: "numeric" },
    {
      name: "dimensions",
      type: "object",
      meta: {
        properties: [
          { name: "length", type: "numeric" },
          { name: "width", type: "numeric" },
          { name: "height", type: "numeric" },
        ],
      },
    },

    // Deep attributes
    {
      name: "dy_attributes",
      type: "fixed_object_list",
      meta: {
        properties: [
          {
            name: "key",
            type: "category",
            values: ["VALID", "APPROVED"],
          },
          {
            name: "value",
            type: "category",
            values: [true, false, "APPROVED", "REJECT"],
          },
        ],
      },
      position_dict: [{ key: "VALID" }, { key: "APPROVED" }],
    },
    {
      name: "rates",
      type: "statistic_object_list",
      meta: {
        properties: [
          { name: "timestamp", type: "datetime" },
          { name: "rating", type: "numeric" },
        ],
      },
    },
  ],
};

function generateLabels(num: number, labelSize = 10): Array<string> {
  const allLabels = new Array(Math.round(labelSize)).fill("").map(() => faker.word.noun());
  const generateLabels = new Array(num).fill("").map(() => faker.helpers.arrayElement(allLabels));
  generateLabels._indexes = generateLabels.map((l) => allLabels.findIndex((v) => v == l));
  generateLabels._toLabel = (idx: number) => allLabels[idx];
  return generateLabels;
}

function splitTestData(
  vectors: Array<Vector>,
  labels: Array<string>,
): [Array<number>, Array<number>, Array<number>, Array<number>] {
  const X_train = [],
    y_train = [],
    X_test = [],
    y_test = [];
  for (const [index, vector] of vectors.entries()) {
    if (faker.datatype.boolean(0.7)) {
      X_train.push(vector);
      y_train.push(labels[index]);
    } else {
      X_test.push(vector);
      y_test.push(labels[index]);
    }
  }
  return [X_train, y_train, X_test, y_test];
}

function accuracyScore(predictions: Array<number>, actualLabels: Array<number>) {
  if (predictions.length !== actualLabels.length) {
    throw new Error("Number of predictions must match the number of actual labels.");
  }

  const correctPredictions = predictions.reduce((count, prediction, index) => {
    return prediction === actualLabels[index] ? count + 1 : count;
  }, 0);

  return correctPredictions / predictions.length;
}

function prepareTrainData(
  volume: number,
  labelNum = 10,
  rowModifier?: (rowObjectData: any, categoryIndex: number) => void,
) {
  const generatedLabels = generateLabels(volume, labelNum);
  const generatedLabelIndexes: Array<number> = generatedLabels._indexes;
  const generatedDataList = new Array(volume).fill({}).map(() => generate(mobilePhoneMeta));

  if (rowModifier) {
    for (const [dataIndex, categoryIndex] of generatedLabelIndexes.entries()) {
      const data = generatedDataList[dataIndex];
      rowModifier(data, categoryIndex);
    }
  }

  const encoder = new ObjectEncoder(mobilePhoneMeta);
  const dataset = generatedDataList.map((data) => encoder.encode(data));
  const features = encoder.features();
  const [X_train, y_train, X_test, y_test] = splitTestData(dataset, generatedLabelIndexes);
  return {
    features,
    encoder,
    dataset,
    X_train,
    X_test,
    y_train,
    y_test,
  };
}

describe("Encoder Util Test Suite", () => {
  it("should support generate random object", () => {
    const obj = generate(mobilePhoneMeta);
    expect(obj).not.toBeUndefined();
    const encoder = new ObjectEncoder(mobilePhoneMeta);
    const vec = encoder.encode(obj);
    const features = encoder.features();
    expect(vec).toHaveLength(features.length);
  });

  it("should support gen list data and train with random forest", async () => {
    const { X_train, y_train, X_test, y_test } = prepareTrainData(20);
    const clf = new RandomForestClassifier({ nEstimators: 20 });
    clf.train(X_train, y_train);
    const predictions = clf.predict(X_test);
    const accuracyRate = accuracyScore(predictions, y_test);
    expect(accuracyRate).not.toBeUndefined();
  });

  it("should support be able to support train a model care about deep list data", async () => {
    function dataEnhancer(data: any, categoryIndex: number) {
      const dy_attributes = data["dy_attributes"];
      dy_attributes[0].value = faker.datatype.boolean();
      switch (categoryIndex) {
        case 0:
          dy_attributes[1].value = "REJECTED";
          data.rates = [
            {
              timestamp: faker.date.anytime(),
              rating: faker.number.float({ min: 0, max: 4 }),
            },
          ];
          break;
        case 1:
          dy_attributes[1].value = "APPROVED";
          data.rates = [
            {
              timestamp: faker.date.anytime(),
              rating: faker.number.float({ min: 0, max: 4 }),
            },
          ];
          break;
        case 2:
          dy_attributes[1].value = faker.helpers.arrayElement("APPROVED", "REJECTED");
          data.rates = [
            {
              timestamp: faker.date.anytime(),
              rating: faker.number.float({ min: 9, max: 10 }),
            },
          ];
          break;
        case 3:
          dy_attributes[1].value = faker.helpers.arrayElement("APPROVED", "REJECTED");
          data.rates = [
            {
              timestamp: faker.date.anytime(),
              rating: faker.number.float({ min: 4, max: 9 }),
            },
          ];
          break;
        default:
          break;
      }
    }
    const { X_train, y_train, X_test, y_test, features } = prepareTrainData(100, 4, dataEnhancer);

    const clf = new RandomForestClassifier({
      nEstimators: 25,
      treeOptions: { maxDepth: 5 },
      useSampleBagging: true,
    });
    clf.train(X_train, y_train);
    const predictions = clf.predict(X_test);
    const accuracyRate = accuracyScore(predictions, y_test);
    const mostImportantFeatures = (clf.featureImportance() as Array<number>)
      .map((imp, idx) => ({ imp, feat: features[idx] }))
      .sort((a, b) => b.imp - a.imp)
      .slice(0, 10);
    const mostImportantFeatureNames = mostImportantFeatures.map((i) => i.feat);

    expect(mostImportantFeatureNames.includes("root_dy_attributes_1_value_is_APPROVED")).toBeTruthy();

    expect(accuracyRate).toBeGreaterThan(0.7);
  });
});
