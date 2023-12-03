import { metadataValidator } from '../src/encoders/Metadata.js';

describe('ObjectMetadata Test Suite', () => {

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
