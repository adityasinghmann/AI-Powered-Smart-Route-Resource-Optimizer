export function seededRandom(seed) {
  let value = seed;
  return function random() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}
