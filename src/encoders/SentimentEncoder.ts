import natural from "natural";
import Encoder from "./Encoder.js";
import { DecodeNotSupportedError } from "./Errors.js";
import { Vector } from "./type.js";
import { isNull, nullVector } from "./util.js";

const { PorterStemmer, SentimentAnalyzer, WordTokenizer } = natural;

const tokenizer = new WordTokenizer();

/**
 * sentiment encoder (en only)
 *
 * @human
 */
export class EnglishSentimentEncoder implements Encoder<string> {
  #analyzer: natural.SentimentAnalyzer;

  constructor() {
    this.#analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
  }

  encode(value: string): Vector {
    const tokens = tokenizer.tokenize(value);
    if (isNull(tokens)) {
      return nullVector(this.length);
    }
    return [this.#analyzer.getSentiment(tokens as any)];
  }

  decode(_vec: Vector): string {
    throw new DecodeNotSupportedError();
  }

  features(name: string): string[] {
    return [name];
  }

  get length(): number {
    return 1;
  }
}

export default EnglishSentimentEncoder;
