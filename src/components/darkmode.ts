"use client";

import { getCookie, setCookie } from "cookies-next";

export default function DarkModeUpdater() {
  // Client ONLY
  if (typeof window === "undefined") return null;

  // Check if the user has set a dark mode preference
  const darkMode = getCookie("dark-mode") === "true";
  const mq = window.matchMedia("(prefers-color-scheme: dark)");

  // Update the cookie if the user's preference has changed
  if (mq.matches !== darkMode) {
    updateDarkMode(mq.matches);
  }

  // Watch for changes
  mq.addEventListener("change", (e) => {
    updateDarkMode(e.matches);
  });

  return null;
}

function updateDarkMode(enabled: boolean) {
  setCookie("dark-mode", enabled.toString());

  const targets = document.querySelectorAll("[data-darkmode-target]");
  if (targets.length === 0) {
    console.warn(
      "No target found for dark mode! Make sure you have a data-darkmode-target attribute an element.",
    );
  }
  for (const target of targets) {
    target.classList.toggle("dark", enabled);
  }
}
