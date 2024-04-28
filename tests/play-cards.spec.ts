import { test } from "@playwright/test"

import {
  expectCellToBeEmpty,
  expectCellToHavePiece,
  expectTurnPointsToBe,
  resetStartingHandCards,
  selectHomeRowCell,
  selectNthCard,
  selectPlayMat,
  setStartingHandCard,
  startGame,
} from "./testHelpers"

test("play tactic card", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await resetStartingHandCards(page)
  await setStartingHandCard("ManeuverForward")(1)(page)
  await startGame(page)

  // place hoplite piece
  await selectHomeRowCell("White", "B")(page)
  await expectCellToHavePiece("B6")("White")(page)

  // select and play maneuver forward card
  await selectNthCard(0)(page)
  await selectHomeRowCell("White", "B")(page)

  // expect hoplite piece to have maneuvered forward
  await expectCellToHavePiece("B5")("White")(page)
  await expectCellToBeEmpty("B6")(page)
})

test("play strategy card", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await resetStartingHandCards(page)
  await setStartingHandCard("DeployHoplite")(1)(page)
  await startGame(page)

  await expectTurnPointsToBe({
    resourcePoints: 0,
    strategyPoints: 1,
    tacticPoints: 1,
    placementPoints: 1,
  })(page)

  await selectNthCard(0)(page)
  await selectPlayMat(page)

  await expectTurnPointsToBe({
    resourcePoints: 0,
    strategyPoints: 0,
    tacticPoints: 1,
    placementPoints: 2,
  })(page)
})
