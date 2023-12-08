export class NotSupportedError extends Error {
  constructor(feature: string) {
    super(`feature ${feature} is not supported`);
  }
}

export class DecodeNotSupportedError extends NotSupportedError {
  constructor() {
    super("decode");
  }
}
