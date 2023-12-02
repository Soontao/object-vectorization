import { DateTime } from "luxon";
import { Vector } from "../type";
import { Encoder } from "./Encoder";

/**
 * @ai
 * @human
 */
export class DateTimeEncoder implements Encoder<string> {
  encode(value: string): Vector {
    const dateTime = DateTime.fromISO(value);

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

    let dateTime = DateTime.fromObject({
      year,
      month,
      day,
      hour,
      minute,
      second,
    });

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
