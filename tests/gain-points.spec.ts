import { test } from "@playwright/test"

import { startGame } from "./testHelpers"

test("gain a point when taking a piece", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await startGame(page)
})

test("gain 5 points when crossing the board", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await startGame(page)
})
