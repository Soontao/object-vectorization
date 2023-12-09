// @ts-nocheck
import { faker } from "@faker-js/faker";
import { Property } from "../src/encoders/Metadata.js";
import { ObjectMetadata } from "../src/index.js";

const usedPropertyNames = new Set();

const generateUniquePropertyName = () => {
  let newName;
  do {
    newName = faker.lorem.word();
  } while (usedPropertyNames.has(newName));
  usedPropertyNames.add(newName);
  return newName;
};

const generateRandomProperty = (depth: number): Property => {
  const plainPropertyType = [
    "category",
    "murmur_hash",
    "multi_category",
    "en_sentiment",
    "bool",
    "uuid",
    "numeric",
    "datetime",
  ];
  const deepObjectPropertyType = ["object", "fixed_object_list", "statistic_object_list"];
  const dataType = faker.helpers.arrayElement(
    depth > 1 ? [...plainPropertyType, ...deepObjectPropertyType] : plainPropertyType,
  );

  const property: Property = {
    name: generateUniquePropertyName(),
    type: dataType as any,
  };

  switch (property.type) {
    case "category":
    case "multi_category":
      property.values = Array.from(
        {
          length: faker.number.int({ min: 1, max: 5 }),
        },
        () => faker.lorem.word(),
      );
      break;
    case "object":
    case "fixed_object_list":
    case "statistic_object_list":
      property.meta = generateRandomMetadata(depth - 1);

      if (dataType === "fixed_object_list") {
        const listCodeKey = property.meta.properties[0].name;
        property.position_dict = Array.from(
          {
            length: faker.number.int({ min: 1, max: 5 }),
          },
          () => ({
            [listCodeKey]: generateUniquePropertyName(),
          }),
        );
      }
    default:
      break;
  }

  return property;
};

// Random data generator for the ObjectMetadata interface
export const generateRandomMetadata = (depth: number): ObjectMetadata => {
  usedPropertyNames.clear(); // Reset used property names for each metadata generation
  return {
    properties: Array.from(
      {
        length: faker.number.int({ min: 5, max: 10 }),
      },
      () => generateRandomProperty(depth),
    ),
  };
};

export function generateRandomData(meta: ObjectMetadata) {
  const obj = {};

  for (const property of meta.properties) {
    switch (property.type) {
      case "category":
      case "multi_category":
        obj[property.name] = faker.helpers.arrayElement(property.values);
        break;
      case "uuid":
        obj[property.name] = faker.string.uuid();
        break;
      case "en_sentiment":
        obj[property] = faker.number.float({ min: -10, max: 10 });
        break;
      case "murmur_hash":
        obj[property] = faker.number.int({ min: 0, max: 2 ** 16 });
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
        obj[property.name] = property.position_dict.map((p) => ({
          ...generateRandomData(property.meta),
          ...p,
        }));
        break;
      case "statistic_object_list":
        obj[property.name] = new Array(faker.number.int({ min: 1, max: 10 }))
          .fill({})
          .map(() => generateRandomData(property.meta));
        break;
      case "object":
        obj[property.name] = generateRandomData(property.meta);
        break;
      default:
        throw new Error(`property ${property.name} with '${property.type}' is not supported yet`);
    }
  }

  return obj;
}
