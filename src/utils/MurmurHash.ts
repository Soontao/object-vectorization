/* eslint-disable prefer-const */
/* eslint-disable camelcase */

/**
 * murmurhash3 private implementation
 *
 * @param plain
 * @param seed random seed
 * @returns the hashed value [0, 2^32 - 1]
 */
export function murmurhash3(plain: string, seed: number = 42): number {
  let remainder, bytes, h1, c1, c2, k1, i;

  remainder = plain.length & 3; // key.length % 4
  bytes = plain.length - remainder;
  h1 = seed;
  c1 = 0xcc9e2d51;
  c2 = 0x1b873593;
  i = 0;

  while (i < bytes) {
    k1 =
      (plain.charCodeAt(i) & 0xff) |
      ((plain.charCodeAt(++i) & 0xff) << 8) |
      ((plain.charCodeAt(++i) & 0xff) << 16) |
      ((plain.charCodeAt(++i) & 0xff) << 24);
    ++i;

    k1 = (k1 * c1) >>> 0;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = (k1 * c2) >>> 0;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = (h1 * 5 + 0xe6546b64) >>> 0;
  }

  k1 = 0;

  switch (remainder) {
    case 3:
      k1 ^= (plain.charCodeAt(i + 2) & 0xff) << 16;
    case 2:
      k1 ^= (plain.charCodeAt(i + 1) & 0xff) << 8;
    case 1:
      k1 ^= plain.charCodeAt(i) & 0xff;

      k1 = (k1 * c1) >>> 0;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = (k1 * c2) >>> 0;
      h1 ^= k1;
  }

  h1 ^= plain.length;

  h1 ^= h1 >>> 16;
  h1 = (h1 * 0x85ebca6b) >>> 0;
  h1 ^= h1 >>> 13;
  h1 = (h1 * 0xc2b2ae35) >>> 0;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
}

export default murmurhash3;
