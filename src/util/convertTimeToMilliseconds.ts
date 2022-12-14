type TimeUnits = "minutes" | "hours";

const minutesToMilliseconds = (minutes: number) => minutes * 60 * 1000;
const hoursToMilliseconds = (hours: number) =>
  minutesToMilliseconds(hours) * 60;

const convertTimeToMilliseconds = (amount: number, units: TimeUnits): number =>
  units === "minutes"
    ? minutesToMilliseconds(amount)
    : hoursToMilliseconds(amount);

export default convertTimeToMilliseconds;
