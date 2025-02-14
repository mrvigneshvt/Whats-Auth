import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const timeZone = "Asia/Kolkata";

export function getTime() {
  try {
    const date = new Date();

    const istDate = toZonedTime(date, timeZone);

    return format(istDate, "yyyy-MM-dd HH:mm", { timeZone });
  } catch (error) {
    console.log("error in Time:::", error);
  }
}

console.log(getTime());
