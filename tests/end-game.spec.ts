import { test } from "@playwright/test"

import { endGame, startGame } from "./testHelpers"

test("start and end game by pressing end game", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await startGame(page)

  await endGame(page)
})
