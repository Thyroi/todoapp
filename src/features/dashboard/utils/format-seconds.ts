export function formatSeconds(seconds: number) {
  const minutesPart = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secondsPart = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutesPart}:${secondsPart}`;
}
