// @ts-nocheck
import { faker } from "@faker-js/faker";
import { RandomForestClassifier } from "ml-random-forest";
import ObjectMetadata from "../src/encoders/Metadata";
import ObjectEncoder from "../src/encoders/ObjectEncoder";
import { Vector } from "../src/encoders/type";

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

const generate = (meta: ObjectMetadata) => {
  const obj = {};

  for (const property of meta.properties) {
    switch (property.type) {
      case "category":
        obj[property.name] = faker.helpers.arrayElement(property.values);
        break;
      case "datetime":
        obj[property.name] = faker.date.recent();
        break;
      case "numeric":
        obj[property.name] = faker.number.float({ min: 10, max: 100000 });
        break;
      case "bool":
        obj[property.name] = faker.datatype.boolean();
        break;
      case "fixed_object_list":
        obj[property.name] = property.position_dict.map((p) => ({ ...generate(property.meta), ...p }));
        break;
      case "statistic_object_list":
        obj[property.name] = new Array(faker.number.int({ min: 1, max: 10 }))
          .fill({})
          .map(() => generate(property.meta));
        break;
      case "object":
        obj[property.name] = generate(property.meta);
        break;
      default:
        // Use faker for other types
        obj[property.name] = faker[property.type.toLowerCase()]();
        break;
    }
  }

  return obj;
};

function generateLabels(num: number, labelSize = 10): Array<string> {
  const allLabels = new Array(Math.round(labelSize)).fill("").map(() => faker.word.noun());
  const generateLabels = new Array(num).fill("").map(() => faker.helpers.arrayElement(allLabels));
  generateLabels._indexes = generateLabels.map((l) => allLabels.findIndex((v) => v == l));
  generateLabels._toLabel = (idx: number) => allLabels[idx];
  return generateLabels;
}

function splitTestData(vectors: Array<Vector>, labels: Array<string>) {
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
    const { X_train, y_train, X_test, y_test } = prepareTrainData(100, 4, (data, categoryIndex) => {
      const dy_attributes = data["dy_attributes"];
      switch (categoryIndex) {
        case 0:
          dy_attributes[1].value = "REJECTED";
          break;
        case 1:
          dy_attributes[1].value = "APPROVED";
          break;
        case 2:
          data.rates = [
            {
              timestamp: faker.date.anytime(),
              rating: faker.number.float({ min: 9, max: 10 }),
            },
          ];
          break;
        case 3:
          data.rates = [
            {
              timestamp: faker.date.anytime(),
              rating: faker.number.float({ min: 4, max: 8 }),
            },
          ];
          break;
        default:
          break;
      }
    });

    const clf = new RandomForestClassifier({ nEstimators: 20 });
    clf.train(X_train, y_train);
    const predictions = clf.predict(X_test);
    const accuracyRate = accuracyScore(predictions, y_test);
    expect(accuracyRate).toBeGreaterThan(0.8);
  });
});
