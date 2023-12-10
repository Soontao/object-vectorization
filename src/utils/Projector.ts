/* eslint-disable @typescript-eslint/indent */
import { ObjectEncoder, ObjectMetadata } from "../index.js";

export function flattenObject(obj: any, parentKey?: string): Array<{ key: string; val: string }> {
  const result: Array<{ key: string; val: string }> = [];

  for (const [key, val] of Object.entries(obj)) {
    const currentKey = parentKey ? `${parentKey}_${key}` : key;

    if (typeof val === "object" && val !== null) {
      // Recursively flatten nested objects
      result.push(...flattenObject(val, currentKey));
    } else {
      if (["number", "string"].includes(typeof val)) {
        result.push({ key: currentKey, val: String(val) });
      } else {
        result.push({ key: currentKey, val: JSON.stringify(val) });
      }
    }
  }

  return result;
}

export function createProjectorValues(
  meta: ObjectMetadata,
  items: Array<any>,
  importantFeaturesIndexes?: Array<number>,
) {
  const e = new ObjectEncoder(meta);

  const vectors = items.map((i) => e.encode(i));
  const tsv = vectors
    .map((v) =>
      importantFeaturesIndexes == undefined
        ? v.map(String).join("\t")
        : importantFeaturesIndexes
            .map((idx) => v[idx])
            .map(String)
            .join("\t"),
    )
    .join("\n");
  const metaHeaders = flattenObject(items[0]).map((v) => v.key);
  const metadata = items.map((i) => flattenObject(i));
  const metaTsv = [
    metaHeaders.join("\t"),
    ...metadata.map((meta) =>
      Object.values(meta)
        .map((v) => v.val)
        .join("\t"),
    ),
  ].join("\n");
  return {
    tsv,
    metaTsv,
  };
}
