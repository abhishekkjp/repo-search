import axe from "axe-core";

/**
 * Runs axe on rendered DOM and returns readable violation summaries.
 * Colour contrast is skipped: jsdom has no layout or real styles, so axe
 * cannot measure it. Lighthouse covers contrast in the browser later.
 */
export async function getViolations(container: HTMLElement): Promise<string[]> {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`,
  );
}
