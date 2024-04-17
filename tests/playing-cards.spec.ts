import { expect, test } from "@playwright/test"

// import { expectCurrentPlayerToBe, expectCellToHavePiece } from "./expectations"

test("Select Playmat Card", async ({ page }) => {
  await page.goto("http://localhost:3000")

  // Start game
  await page.getByTestId("start-game-button").click()
  await expect(page.getByTestId("game-board")).toBeVisible()

  // get and select card that requires playmat

  // select playmat

  // expect card was played correctly
})

test("Select Piece Card", async ({ page }) => {
  await page.goto("http://localhost:3000")

  // Start game
  await page.getByTestId("start-game-button").click()
  await expect(page.getByTestId("game-board")).toBeVisible()

  // get and select card that requires selecting a board piece

  // select board piece

  // expect card was played correctly and board was updated correctly
})
