# Object Vectorization

[![npm version](https://img.shields.io/npm/v/object-vectorization?label=object-vectorization)](https://www.npmjs.com/package/object-vectorization)
[![node-test](https://github.com/Soontao/object-vectorization/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Soontao/object-vectorization/actions/workflows/nodejs.yml)
[![codecov](https://codecov.io/gh/Soontao/object-vectorization/graph/badge.svg?token=yoJAm8JUOd)](https://codecov.io/gh/Soontao/object-vectorization)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Soontao_object-vectorization&metric=security_rating)](https://sonarcloud.io/dashboard?id=Soontao_object-vectorization)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=Soontao_object-vectorization&metric=sqale_index)](https://sonarcloud.io/dashboard?id=Soontao_object-vectorization)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Soontao_object-vectorization&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=Soontao_object-vectorization)

> `Object Vectorization` is a process of converting structured data objects into numerical vectors,enabling machine learning models to understand and process the information contained in these objects.

## Overview

Object vectorization is crucial in scenarios where machine learning models require numerical input, and the data is initially presented as structured objects. This framework facilitates the transformation of diverse object types, including `categories`, `numbers`, `booleans`, `datetime`, and `nested structures`, into numerical `vectors` that can be fed into machine learning models.

## Quick Start

To encode a simple object to a vector, you'll follow these steps. Use the provided JavaScript comments to guide you through the process:

```ts
import { ObjectMetadata, ObjectEncoder } from "object-vectorization";

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
```

## Key Components

### Object Metadata

The `ObjectMetadata` defines the structure of the object, specifying properties, their types, and possible values. It includes support for nested objects and lists, enabling the representation of complex, hierarchical data.

To define `ObjectMetadata`, you need to create a JavaScript object that describes the structure of the data you want to encode. The metadata provides information about the properties, their types, and any constraints or values they may have. Below is a guide on how to define `ObjectMetadata`

#### Basic Structure

The `ObjectMetadata` object consists of a `properties` array, where each element defines a property of the object.

```javascript
const basicMetadata = {
  properties: [
    { name: "property1", type: "numeric" },
    { name: "property2", type: "category", values: ["value1", "value2", "value3"] },
    // Add more properties as needed
  ],
};
```

#### Property Types

In the `ObjectMetadata`, each property must have a specified `type` to define its nature. The supported types include:

- **numeric**: Represents numeric values.
- **category**: Denotes categorical values with predefined options.
- **datetime**: Signifies date and time values.
- **bool**: Represents Boolean values.
- **uuid**: Represents universally unique identifier (UUID) values.
- **object**: Represents nested objects within the property.
- **fixed_object_list**: Indicates a fixed list of objects with a predefined structure.
- **statistic_object_list**: Represents a dynamic list of objects with varying structures.

Choose the appropriate type for each property based on the nature of the data it represents. This ensures a clear and consistent definition within your `ObjectMetadata`.

#### Property Values

For properties of type `category`, you can provide an array of allowed values:

```javascript
{ name: "property2", type: "category", values: ["value1", "value2", "value3"] }
```

#### Nested Objects

You can define nested objects within the `properties` array for more complex data structures:

```javascript
const nestedMetadata = {
  properties: [
    { name: "property1", type: "numeric" },
    {
      name: "nestedObject",
      type: "object",
      meta: {
        properties: [
          { name: "nestedProperty1", type: "numeric" },
          { name: "nestedProperty2", type: "category", values: ["nestedValue1", "nestedValue2"] },
        ],
      },
    },
  ],
};
```

Certainly! Here's an improved and more detailed explanation for the "Lists of Objects" section using the provided `Property` interface:

#### Lists of Objects

For properties of type `fixed_object_list` or `statistic_object_list`, you define a list of objects, each adhering to a specific structure. Use the `position_dict` property to map input list items to their correct positions within the encoded vector.

```typescript
const listMetadata: Property = {
  name: "objectList",
  type: "fixed_object_list",
  meta: {
    properties: [
      { name: "listProperty1", type: "numeric" },
      { name: "listProperty2", type: "category", values: ["listValue1", "listValue2"] },
    ],
  },
  position_dict: [
    { listProperty1: 42, listProperty2: "listValue1" },
    // Add more positions as needed
  ],
};
```

In the example above, we have a property named "objectList" of type `fixed_object_list`. The `meta` property specifies the structure of objects within the list, consisting of "listProperty1" of type `numeric` and "listProperty2" of type `category` with predefined values.

The `position_dict` array is crucial for assigning values to the correct positions within the encoded vector. Each item in the input list is matched with a position object in `position_dict`, ensuring proper alignment in the encoded representation.

This setup facilitates the encoding and decoding of lists of objects, allowing you to maintain a structured and organized representation of your data. Adjust the property names, types, and positions to suit the specific requirements of your application.

### CategoryEncoder

The `CategoryEncoder` is designed to handle the encoding and decoding of categorical values, commonly used in machine learning tasks. It specifically employs a technique called one-hot encoding to represent categorical values numerically. Here's a detailed explanation of its functionality:

#### One-Hot Encoding

One-hot encoding is a method of representing categorical variables as binary vectors. For a categorical variable with `n` possible values, one-hot encoding transforms it into a binary vector of length `n`, where only one element is 1 (hot), and the rest are 0 (cold). Each position in the vector corresponds to a specific category.

#### Implementation Details

- **Constructor**: The `CategoryEncoder` takes an array of categorical values (`values`) during initialization. It builds an index map (`#valueIndex`) to efficiently look up the index of a value during encoding.

- **Features Method**: The `features` method generates an array of feature names based on the provided `name` parameter. For each unique value in the categorical set, a feature name is constructed in the format `${name}_is_${String(value)}`.

- **Encode Method**: When encoding a specific value, the `encode` method creates a binary vector where the position corresponding to the value's index is set to 1. If the value is `undefined`, the vector is filled with `NaN` to indicate missing data.

- **Decode Method**: The `decode` method takes a binary vector and returns the original categorical value. It looks for the position with a value of 1 and retrieves the corresponding value from the index.

- **Length Property**: The `length` property indicates the total number of unique values in the categorical set.

Example Usage

```javascript
// Example of using CategoryEncoder
const categories = ["red", "green", "blue"];
const categoryEncoder = new CategoryEncoder(categories);

const featureNames = categoryEncoder.features("color");
console.log(featureNames);
// Output: ["color_is_red", "color_is_green", "color_is_blue"]

const encodedVector = categoryEncoder.encode("green");
console.log(encodedVector);
// Output: [0, 1, 0] (binary representation of "green" in the categorical set)

const decodedValue = categoryEncoder.decode([0, 1, 0]);
console.log(decodedValue);
// Output: "green"
```

The `CategoryEncoder` simplifies the process of working with categorical data by providing an intuitive and efficient way to encode and decode categorical values.

### ObjectEncoder

The `ObjectEncoder` class plays a crucial role in transforming objects, guided by their metadata, into numerical vectors. It is a versatile tool that supports encoding and decoding for various property types, including categories, numbers, booleans, datetime, objects, and fixed or statistical lists.

#### Constructor

The constructor takes an instance of `ObjectMetadata` as its parameter. The metadata defines the structure of the object, specifying properties, their types, and possible values. The `ObjectEncoder` internally sorts and fills encoders for the provided metadata.

```javascript
// Example of creating an ObjectEncoder instance
const encoder = new ObjectEncoder(myObjectMetadata);
```

#### Features Method

The `features` method generates an array of feature names based on the properties defined in the metadata. It organizes the features under the specified `name` parameter, providing a clear structure for the encoded vector.

```javascript
// Example of getting feature names from an ObjectEncoder instance
const featureNames = encoder.features("myObject");
console.log(featureNames);
// Output: ["myObject_property1_feature1", "myObject_property1_feature2", "myObject_property2", ...]
```

#### Encode Method

The `encode` method takes an object conforming to the structure defined in the metadata and transforms it into a numerical vector. It processes each property using the corresponding encoder and concatenates the results into a single vector.

```javascript
// Example of encoding an object using ObjectEncoder
const myObject = {
  property1: "someValue",
  property2: 42,
  // ... other properties
};
const encodedVector = encoder.encode(myObject);
console.log(encodedVector);
// Output: [0, 1, 0, 0, 42, ...]
```

#### Decode Method

The `decode` method performs the inverse operation, taking a numerical vector and reconstructing the original object. It iterates through the properties, decoding segments of the vector using the respective property encoders.

```javascript
// Example of decoding a vector using ObjectEncoder
const decodedObject = encoder.decode(encodedVector);
console.log(decodedObject);
// Output: { property1: "someValue", property2: 42, ... }
```

- Ensure that the provided object adheres to the structure defined in the metadata.
- Pay attention to the feature names generated by the `features` method for a clear understanding of the encoded vector.

The `ObjectEncoder` simplifies the process of working with complex objects in machine learning scenarios, providing a seamless transition between object-oriented and numerical representations.

### FixedListEncoder

The `FixedListEncoder` class is responsible for encoding and decoding fixed lists within the object metadata. It ensures proper handling of missing or undefined values during encoding.

### StatisticListEncoder

The `StatisticListEncoder` extends the encoding capabilities by introducing statistical aggregations for each property. It allows you to calculate statistics such as `max`, `min`, `avg`, `count`, and `sum` across the values of a property.

The `StatisticListEncoder` adds a layer of complexity to encoding, enabling you to capture more nuanced information about your data through statistical summaries.

## [CHANGELOG](./CHANGELOG.md)

## [License](./LICENSE)
