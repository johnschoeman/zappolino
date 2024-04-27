import { expect, test } from "@playwright/test"

import { selectHomeRowCell, selectNthCard,startGame } from "./testHelpers"

test("Play tactic card", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await startGame(page)

  await selectHomeRowCell("White", "B")(page)

  await selectNthCard(1)(page)

  // select playmat

  // expect card was played correctly
})

test("Play strategy card", async ({ page }) => {
  await page.goto("http://localhost:3000")

  // Start game
  await page.getByTestId("start-game-button").click()
  await expect(page.getByTestId("game-board")).toBeVisible()

  // get and select card that requires selecting a board piece

  // select board piece

  // expect card was played correctly and board was updated correctly
})
