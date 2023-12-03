import Encoder from "./Encoder.js";
import ObjectMetadata from "./Metadata.js";
import ObjectEncoder, { sortMetaAndFillEncoders } from "./ObjectEncoder.js";
import { Vector } from "./type.js";

type StatisticFunc = (values: Array<number>) => number;

const sum: StatisticFunc = (values) => values.reduce((pre, cur) => pre + cur, 0);

const statisticFuncs: { [col: string]: StatisticFunc } = {
  max: (values) => Math.max(...values),
  min: (values) => Math.min(...values),
  avg: (values) => sum(values) / values.length,
  count: (values) => values.length,
  sum,
};

const statisticFuncNames = Object.keys(statisticFuncs);
const statisticColsNum = statisticFuncNames.length;

/**
 * @human
 */
export class StatisticListEncoder<T> implements Encoder<Array<T>> {
  #meta: ObjectMetadata;

  #encoder: ObjectEncoder<T>;

  #features!: Array<string>;

  constructor(meta: ObjectMetadata) {
    this.#meta = sortMetaAndFillEncoders(meta);
    this.#encoder = new ObjectEncoder(this.#meta);
  }

  features(name: string = "root"): string[] {
    if (this.#features == undefined) {
      const statisticFeatures = new Array(this.#encoder.length * statisticColsNum);
      for (const [funcIdx, funcName] of statisticFuncNames.entries()) {
        for (const [idx, objFeat] of this.#encoder.features(name).entries()) {
          const aggValueLocate = this.#encoder.length * funcIdx + idx;
          statisticFeatures[aggValueLocate] = `${objFeat}_${funcName}`;
        }
      }
      this.#features = statisticFeatures;
    }

    return this.#features;
  }

  encode(value: T[]): Vector {
    const vectors = value.map((v) => this.#encoder.encode(v));
    const statisticVector = new Array(this.#encoder.length * statisticColsNum);
    for (const [funcIdx, name] of statisticFuncNames.entries()) {
      const statisticFunc = statisticFuncs[name];
      for (let idx = 0; idx < this.#encoder.length; idx++) {
        const aggValueLocate = this.#encoder.length * funcIdx + idx;
        const aggValue = statisticFunc(vectors.map((v) => v[idx]));
        statisticVector[aggValueLocate] = aggValue;
      }
    }
    return statisticVector;
  }

  decode(_vec: Vector): T[] {
    throw new Error("Method not supported.");
  }

  get length(): number {
    return this.#encoder.length! * statisticColsNum;
  }
}

export default StatisticListEncoder;
