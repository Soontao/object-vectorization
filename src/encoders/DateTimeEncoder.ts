import { DateTime } from "luxon";
import { AbstractEncoder } from "./Encoder.js";
import { Vector } from "./type.js";
import { isNull, nullVector } from "./util.js";

const FEATURES = ["year", "month", "day", "isoWeek", "hour", "minute", "second"];

/**
 * @ai
 * @human
 */
export class DateTimeEncoder extends AbstractEncoder<string> {
  features(): string[] {
    return FEATURES.map((v) => `${this._property.name}_${v}`);
  }

  encode(value: string | Date): Vector {
    if (isNull(value)) {
      return nullVector(this.length);
    }
    const dateTime =
      value instanceof Date ? DateTime.fromJSDate(value).setZone("utc") : DateTime.fromISO(value).setZone("utc");

    if (!dateTime.isValid) {
      return nullVector(this.length);
    }

    const encodedVector = [
      dateTime.year,
      dateTime.month,
      dateTime.day,
      dateTime.weekNumber,
      dateTime.hour,
      dateTime.minute,
      dateTime.second,
    ];

    return encodedVector;
  }

  decode(vec: Vector): string {
    if (vec.length !== this.length) {
      throw new TypeError("Invalid vector length");
    }

    const [year, month, day, , hour, minute, second] = vec;

    const dateTime = DateTime.fromObject(
      {
        year,
        month,
        day,
        hour,
        minute,
        second,
      },
      { zone: "utc" },
    );

    return dateTime.setZone("utc").toISO() as string;
  }

  get length(): number {
    return 7; // year, month, day, isoWeek, hour, minute, second
  }
}

export default DateTimeEncoder;
