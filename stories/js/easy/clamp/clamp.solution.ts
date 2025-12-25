export default function clamp(
  value: number,
  lower: number,
  upper: number,
): number {
  if (lower > value) return lower;
  if (upper < value) return upper;

  return value;
}