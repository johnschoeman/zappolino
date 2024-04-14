import { expect, test, Page } from "@playwright/test"

import { Cell, Player } from "../src/model"

const expectCellToHavePiece =
  (page: Page) =>
  (cellId: string) =>
  async (player: Player.Player): Promise<void> => {
    await expect(page.getByTestId(cellId)).toHaveAttribute(
      "data-cell",
      Cell.show({ _tag: "Piece", player }),
    )
  }

const expectCurrentPlayerToBe =
  (page: Page) =>
  async (player: Player.Player): Promise<void> => {
    await expect(page.getByTestId("current-player")).toHaveText(
      Player.show(player),
    )
  }

test("game play - single turn, place piece", async ({ page }) => {
  await page.goto("http://localhost:3000")

  // Start game
  await page.getByTestId("start-game-button").click()
  await expect(page.getByTestId("game-board")).toBeVisible()

  // expect current player to be white
  await expectCurrentPlayerToBe(page)("White")

  // expect discard pile of 0
  await expect(page.getByTestId("discard-pile-count")).toHaveText("0")
  // expect strategy count of 1 and tactic count of 1
  await expect(page.getByTestId("tactic-count")).toHaveText("1")
  await expect(page.getByTestId("strategy-count")).toHaveText("1")

  // expect to have 5 cards in your hand
  await expect(page.getByTestId("unplayed-card-0")).toBeVisible()
  await expect(page.getByTestId("unplayed-card-1")).toBeVisible()
  await expect(page.getByTestId("unplayed-card-2")).toBeVisible()
  await expect(page.getByTestId("unplayed-card-3")).toBeVisible()
  await expect(page.getByTestId("unplayed-card-4")).toBeVisible()

  // click the place card
  await expect(page.getByTestId("unplayed-card-0")).not.toHaveClass(/selected/)
  await page.getByTestId("unplayed-card-0").click()
  await expect(page.getByTestId("unplayed-card-0")).toHaveClass(/selected/)

  // place a piece
  await page.getByTestId("A4").click()

  // expect to have piece placed
  await expectCellToHavePiece(page)("A4")("White")
  await expect(page.getByTestId("strategy-count")).toHaveText("0")

  // expect to have 1 played card and 4 cards in the hand
  await expect(page.getByTestId("played-card-0")).toBeVisible()
  await expect(page.getByTestId("unplayed-card-0")).toBeVisible()
  await expect(page.getByTestId("unplayed-card-1")).toBeVisible()
  await expect(page.getByTestId("unplayed-card-2")).toBeVisible()
  await expect(page.getByTestId("unplayed-card-3")).toBeVisible()
  await expect(page.getByTestId("unplayed-card-4")).not.toBeVisible()

  // click end turn
  await page.getByTestId("end-turn-button").click()

  // expect board progresses for white
  await expectCellToHavePiece(page)("A3")("White")

  // expect current player to be black
  await expectCurrentPlayerToBe(page)("Black")
})

test("game play - single turn, buy card from supply", async ({ page }) => {
  await page.goto("http://localhost:3000")

  // Start game
  await page.getByTestId("start-game-button").click()
  await expect(page.getByTestId("game-board")).toBeVisible()

  // expect current player to be white
  await expectCurrentPlayerToBe(page)("White")

  // expect discard pile of 0
  await expect(page.getByTestId("discard-pile-count")).toHaveText("0")
  await expect(page.getByTestId("strategy-count")).toHaveText("1")

  // select card from store
  await expect(page.getByTestId("supply-pile-0-count")).toHaveText("8")
  await page.getByTestId("supply-pile-0").click()

  await expect(page.getByTestId("discard-pile-count")).toHaveText("1")
  await expect(page.getByTestId("strategy-count")).toHaveText("0")
  await expect(page.getByTestId("supply-pile-0-count")).toHaveText("7")

  // click end turn
  await page.getByTestId("end-turn-button").click()

  // expect current player to be black
  await expectCurrentPlayerToBe(page)("Black")
})

test("game play - many turns", async ({ page }) => {
  await page.goto("http://localhost:3000")

  // Start game
  await page.getByTestId("start-game-button").click()
  await expect(page.getByTestId("game-board")).toBeVisible()

  // Turn 1 White

  await expectCurrentPlayerToBe(page)("White")
  await expect(page.getByTestId("discard-pile-count")).toHaveText("0")
  await page.getByTestId("unplayed-card-0").click()
  await page.getByTestId("A4").click()
  await expectCellToHavePiece(page)("A4")("White")

  // end turn
  await page.getByTestId("end-turn-button").click()
  await expectCellToHavePiece(page)("A3")("White")

  // Turn 2 Black

  await expectCurrentPlayerToBe(page)("Black")
  await expect(page.getByTestId("discard-pile-count")).toHaveText("0")
  await page.getByTestId("unplayed-card-0").click()
  await page.getByTestId("A0").click()
  await expectCellToHavePiece(page)("A0")("Black")
  await page.getByTestId("end-turn-button").click()

  // end turn
  await expectCellToHavePiece(page)("A1")("Black")
  await expectCellToHavePiece(page)("A3")("White")

  // Turn 3 White

  await expectCurrentPlayerToBe(page)("White")
  await expect(page.getByTestId("discard-pile-count")).toHaveText("5")
  await page.getByTestId("unplayed-card-0").click()
  await page.getByTestId("B4").click()
  await expectCellToHavePiece(page)("B4")("White")

  // End turn
  await page.getByTestId("end-turn-button").click()
  await expectCellToHavePiece(page)("A1")("Black")
  await expectCellToHavePiece(page)("A2")("White")
  await expectCellToHavePiece(page)("B3")("White")

  // Turn 4 Black

  await expect(page.getByTestId("current-player")).toHaveText("Black")
  await expect(page.getByTestId("discard-pile-count")).toHaveText("5")
  await page.getByTestId("unplayed-card-0").click()
  await page.getByTestId("B0").click()
  await expectCurrentPlayerToBe(page)("Black")

  // end turn
  await page.getByTestId("end-turn-button").click()
  await expectCellToHavePiece(page)("A2")("Black")
  await expectCellToHavePiece(page)("B1")("Black")
  await expectCellToHavePiece(page)("B3")("White")

  // Turn 5 White

  await expect(page.getByTestId("current-player")).toHaveText("White")

  await expect(page.getByTestId("discard-pile-count")).toHaveText("0")
  await page.getByTestId("unplayed-card-0").click()
  await page.getByTestId("C4").click()
  await expectCurrentPlayerToBe(page)("White")

  // End turn
  await page.getByTestId("end-turn-button").click()
  await expectCellToHavePiece(page)("A2")("Black")
  await expectCellToHavePiece(page)("B1")("Black")
  await expectCellToHavePiece(page)("B2")("White")
  await expectCellToHavePiece(page)("C3")("White")
})
