import { useEffect, useState } from "react";
import { getSecondsRemaining } from "../utils/countdown";

/** Seconds left until `resetAt`, updated once per second. 0 when null. */
export function useCountdown(resetAt: Date | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (resetAt === null) return;

    const id = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= resetAt.getTime()) window.clearInterval(id);
    }, 1000);

    return () => {
      window.clearInterval(id);
    };
  }, [resetAt]);

  return getSecondsRemaining(resetAt, now);
}
