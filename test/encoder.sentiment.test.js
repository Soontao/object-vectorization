import { DecodeNotSupportedError } from '../src/encoders/Errors.js';
import { EnglishSentimentEncoder } from '../src/encoders/SentimentEncoder.js';

describe('SentimentEncoder', () => {
  it('encode method returns a valid vector', () => {
    const sentimentEncoder = new EnglishSentimentEncoder();
    const inputText = 'This is a positive sentence.';
    const vector = sentimentEncoder.encode(inputText);

    expect(vector).toHaveLength(1);
    expect(vector[0]).toBe(0)
  });

  it('should could support sentiment', () => {
    const e = new EnglishSentimentEncoder()
    expect(e.encode("happy day!")[0]).toBeGreaterThan(0)
    expect(e.encode("unhappy day!")[0]).toBeLessThan(0)
  });

  it('decode method throws DecodeNotSupportedError', () => {
    const sentimentEncoder = new EnglishSentimentEncoder();
    const vector = [0.5];

    expect(() => {
      sentimentEncoder.decode(vector);
    }).toThrow(DecodeNotSupportedError);
  });

  it('features method returns an array with the provided name', () => {
    const sentimentEncoder = new EnglishSentimentEncoder();
    const featureName = 'sentiment';

    const features = sentimentEncoder.features(featureName);

    expect(features).toHaveLength(1);
    expect(features[0]).toBe(featureName);
  });

  it('length method returns 1', () => {
    const sentimentEncoder = new EnglishSentimentEncoder();
    const length = sentimentEncoder.length;

    expect(length).toBe(1);
  });
});
