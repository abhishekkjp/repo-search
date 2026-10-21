/** Joins class names, skipping anything missing or empty. */
export function classNames(
  ...names: readonly (string | false | null | undefined)[]
): string {
  return names
    .filter((name) => typeof name === "string" && name !== "")
    .join(" ");
}
