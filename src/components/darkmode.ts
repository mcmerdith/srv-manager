"use client";

import { getCookie, setCookie } from "cookies-next";

export default function DarkModeUpdater() {
  // Client ONLY
  if (typeof window === "undefined") return null;

  // Check if the user has set a dark mode preference
  const darkMode = getCookie("dark-mode") === "true";
  const mq = window.matchMedia("(prefers-color-scheme: dark)");

  // Watch for changes
  mq.addEventListener("change", (e) => {
    setCookie("dark-mode", e.matches.toString());
    window.location.reload();
  });

  if (mq.matches !== darkMode) {
    setCookie("dark-mode", mq.matches.toString());
    window.location.reload();
  }

  return null;
}
