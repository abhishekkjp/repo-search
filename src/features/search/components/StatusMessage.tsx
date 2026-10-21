import type { ReactNode } from "react";
import { classNames } from "../../../utils/classNames";
import styles from "./StatusMessage.module.css";

interface StatusMessageProps {
  title: string;
  body: string;
  tone?: "neutral" | "danger";
  /** `alert` interrupts screen readers (errors); `status` waits politely. */
  role?: "alert" | "status";
  children?: ReactNode;
}

export function StatusMessage({
  title,
  body,
  tone = "neutral",
  role = "status",
  children,
}: StatusMessageProps) {
  return (
    <section
      role={role}
      className={classNames(styles.box, tone === "danger" && styles.danger)}
    >
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
      {children}
    </section>
  );
}
