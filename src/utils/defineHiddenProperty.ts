export function defineHiddenProperty(obj: any, property: string, value: any, force = false) {
  if (force === true && obj[property] !== undefined) {
    return obj;
  }
  Object.defineProperty(obj, property, { enumerable: false, value });
  return obj;
}

export default defineHiddenProperty;
