/* Session room layout — isolated from app shell. No nav, no header. Full viewport dark. */
import React from "react";

export default function SessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
