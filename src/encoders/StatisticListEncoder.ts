import { variance } from "../utils/variance.js";
import Encoder from "./Encoder.js";
import { DecodeNotSupportedError } from "./Errors.js";
import ObjectMetadata from "./Metadata.js";
import ObjectEncoder, { sortMetaAndFillEncoders } from "./ObjectEncoder.js";
import { Vector } from "./type.js";
import { isNull, isNullVector, nullVector } from "./util.js";

type StatisticFunc = (values: Array<number>) => number;

const diff: StatisticFunc = (values) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return max - min;
};

const sum: StatisticFunc = (values) => values.reduce((pre, cur) => pre + cur, 0);

const statisticFuncs: { [col: string]: StatisticFunc } = {
  max: (values) => Math.max(...values),
  min: (values) => Math.min(...values),
  avg: (values) => sum(values) / values.length,
  diff,
  variance,
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
    if (isNull(value) || value?.length == 0) {
      return nullVector(this.length);
    }
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
    if (isNullVector(_vec)) {
      return null as any;
    }
    throw new DecodeNotSupportedError();
  }

  get length(): number {
    return this.#encoder.length! * statisticColsNum;
  }
}

export default StatisticListEncoder;
