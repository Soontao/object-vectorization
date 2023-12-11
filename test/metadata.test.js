import { mapEncoder, metadataValidator } from '../src/encoders/Metadata.js';

describe('ObjectMetadata Test Suite', () => {

  it('should throw error when use unknown type', () => {
    expect(() => mapEncoder({ name: "ccc", type: "wwww" })).toThrowErrorMatchingSnapshot()
  });

  it('Valid ObjectMetadata', () => {
    const validObjectMetadata = {
      properties: [
        {
          name: 'property1',
          type: 'category',
          values: ["a", 1, false]
        },
      ]
    };
    const r = metadataValidator(validObjectMetadata)
    expect(r).toBe(true);
  });

  it('Invalid ObjectMetadata - Missing properties', () => {
    const invalidObjectMetadata = {
      // Missing properties field
      _encoder_filled: true,
      _sorted: false,
      _length: 5,
    };

    expect(metadataValidator(invalidObjectMetadata)).toBe(false);
  });



});
