// Capture a full-page screenshot of each LFD-facing view.
//
// Usage:
//   1. Start the app:   npm run dev
//   2. In another tab:  npm run screenshots
//
// Override the target with BASE_URL, e.g. against a preview build:
//   npm run build && npm run preview
//   BASE_URL=http://localhost:4173/project-raise-act npm run screenshots
//
// Screenshots are written to ./screenshots/.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

// The app is served under Vite's base path (see vite.config.ts) in both dev
// (5173) and preview (4173), so routes are prefixed with /project-raise-act.
const BASE = (
  process.env.BASE_URL ?? "http://localhost:5173/project-raise-act"
).replace(/\/$/, "");

// Mirrors the documentation's table of contents. Numbered so the files sort
// in walkthrough order.
const PAGES = [
  // LFD's View for User Authorization
  { name: "01-auth-signin", path: "/user-authorization" },
  { name: "02-auth-details", path: "/user-authorization/form" },
  { name: "03-auth-submitted", path: "/user-authorization/confirmation" },
  // LFD's View — Disclosure Statement
  { name: "04-disclosure-landing", path: "/" },
  { name: "05-disclosure-business-info", path: "/register/business-info" },
  { name: "06-disclosure-address", path: "/register/addresses" },
  { name: "07-disclosure-ownership", path: "/register/ownership" },
  { name: "08-disclosure-contacts", path: "/register/contacts" },
  { name: "09-disclosure-review", path: "/register/review" },
  { name: "10-disclosure-submitted", path: "/register/success" },
];

const OUT = path.resolve(process.cwd(), "screenshots");

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2, // crisp @2x captures
  });

  // The app sits behind a client-side password gate (see index.html) that
  // unlocks when localStorage.authed === 'true'. Pre-seed that flag before any
  // page script runs so the gate clears automatically — no password needed.
  await context.addInitScript(() => {
    try {
      localStorage.setItem("authed", "true");
    } catch {
      /* localStorage unavailable — ignore */
    }
  });

  const page = await context.newPage();

  for (const { name, path: route } of PAGES) {
    const url = BASE + route;
    await page.goto(url, { waitUntil: "networkidle" });
    // NYSDS components are custom elements that upgrade after load; give them
    // a beat to render before capturing.
    await page.waitForTimeout(500);
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`✓ ${name.padEnd(30)} ${url}`);
  }

  await browser.close();
  console.log(`\nDone. ${PAGES.length} screenshots in ${OUT}`);
}

main().catch((err) => {
  console.error("\nScreenshot run failed:", err.message);
  console.error("Is the dev server running?  npm run dev");
  process.exit(1);
});
