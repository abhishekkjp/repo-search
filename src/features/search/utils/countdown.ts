/** Whole seconds until `resetAt`, rounded up, never negative. */
export function getSecondsRemaining(resetAt: Date | null, now: number): number {
  if (resetAt === null) return 0;
  return Math.max(0, Math.ceil((resetAt.getTime() - now) / 1000));
}
