import { DateTime } from "luxon";
import { Encoder } from "./Encoder";
import { Vector } from "./type";

/**
 * @ai
 * @human
 */
export class DateTimeEncoder implements Encoder<string> {
  features(name: string): string[] {
    return ["year", "month", "day", "isoWeek", "hour", "minute", "second"].map((v) => `${name}_${v}`);
  }

  encode(value: string | Date): Vector {
    const dateTime =
      value instanceof Date ? DateTime.fromJSDate(value).setZone("utc") : DateTime.fromISO(value).setZone("utc");

    if (!dateTime.isValid) {
      return new Array(this.length).fill(NaN);
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

    if (vec.every(Number.isNaN)) {
      return "1970-01-01T00:00:00.000Z";
    }

    const [year, month, day, isoWeek, hour, minute, second] = vec;

    let dateTime = DateTime.fromObject(
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

    // Check if ISO week is provided, adjust the date accordingly
    if (!isNaN(isoWeek)) {
      dateTime = dateTime.set({ weekNumber: isoWeek });
    }

    return dateTime.setZone("utc").toISO() as string;
  }

  get length(): number {
    return 7; // year, month, day, isoWeek, hour, minute, second
  }
}

export default DateTimeEncoder;
