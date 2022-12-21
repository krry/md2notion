export function dashToTitle(str) {
  return str
    .split(".")[0]
    .split("-")
    .filter((segment) => !segment.match(/(\d+)/))
    .map((word) => word.substring(0, 1).toUpperCase() + word.substring(1))
    .join(" ");
}
