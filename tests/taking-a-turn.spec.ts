import { test } from "@playwright/test"

import {
  endTurn,
  expectCellToHavePiece,
  expectCurrentPlayerToBe,
  expectDiscardCountToBe,
  expectHegemonyToBe,
  expectPlayedCardSize,
  expectToHaveHandSize,
  expectTurnCountToBe,
  expectTurnPointsToBe,
  selectCell,
  selectNthCard,
  startGame,
} from "./testHelpers"

test("single turn - place a piece", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await startGame(page)

  await expectCurrentPlayerToBe("White")(page)
  await expectDiscardCountToBe(0)(page)
  await expectTurnPointsToBe({
    strategyPoints: 1,
    tacticPoints: 1,
    resourcePoints: 0,
  })(page)
  await expectToHaveHandSize(5)(page)

  // ---- Select and play Deploy Hoplite card
  await selectNthCard(0)(page)
  await selectCell("A4")(page)

  await expectCellToHavePiece("A4")("White")(page)
  await expectTurnPointsToBe({
    strategyPoints: 0,
    tacticPoints: 1,
    resourcePoints: 0,
  })(page)
  await expectToHaveHandSize(4)(page)
  await expectPlayedCardSize(1)(page)

  await endTurn(page)

  await expectCellToHavePiece("A3")("White")(page)
  await expectCurrentPlayerToBe("Black")(page)
})

test("many turns - progress the pieces on the board", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await startGame(page)
  await expectHegemonyToBe({ hegemonyWhite: 0, hegemonyBlack: 0 })(page)

  // ---- Turn 1 White

  await expectTurnCountToBe(1)(page)
  await expectCurrentPlayerToBe("White")(page)
  await selectNthCard(0)(page)
  await selectCell("A4")(page)
  await expectCellToHavePiece("A4")("White")(page)

  await endTurn(page)

  await expectCellToHavePiece("A3")("White")(page)

  // ---- Turn 1 Black

  await expectTurnCountToBe(1)(page)
  await expectCurrentPlayerToBe("Black")(page)
  await selectNthCard(0)(page)
  await selectCell("A0")(page)
  await expectCellToHavePiece("A0")("Black")(page)

  await endTurn(page)

  await expectCellToHavePiece("A1")("Black")(page)
  await expectCellToHavePiece("A3")("White")(page)

  // ---- Turn 2 White

  await expectTurnCountToBe(2)(page)
  await expectCurrentPlayerToBe("White")(page)
  await selectNthCard(0)(page)
  await selectCell("B4")(page)
  await expectCellToHavePiece("B4")("White")(page)

  await endTurn(page)
  await expectCellToHavePiece("A1")("Black")(page)
  await expectCellToHavePiece("A2")("White")(page)
  await expectCellToHavePiece("B3")("White")(page)

  // ---- Turn 2 Black

  await expectTurnCountToBe(2)(page)
  await expectCurrentPlayerToBe("Black")(page)
  await selectNthCard(0)(page)
  await selectCell("B0")(page)
  await expectCellToHavePiece("B0")("Black")(page)

  await endTurn(page)
  await expectCellToHavePiece("A2")("Black")(page)
  await expectCellToHavePiece("B1")("Black")(page)
  await expectCellToHavePiece("B3")("White")(page)

  // ---- Turn 3 White

  await expectTurnCountToBe(3)(page)
  await expectCurrentPlayerToBe("White")(page)
  await selectNthCard(0)(page)
  await selectCell("C4")(page)
  await expectCellToHavePiece("C4")("White")(page)

  await endTurn(page)
  await expectCellToHavePiece("A2")("Black")(page)
  await expectCellToHavePiece("B1")("Black")(page)
  await expectCellToHavePiece("B2")("White")(page)
  await expectCellToHavePiece("C3")("White")(page)

  // ---- Turn 3 Black

  await expectTurnCountToBe(3)(page)
  await expectCurrentPlayerToBe("Black")(page)
  await selectNthCard(0)(page)
  await selectCell("C0")(page)
  await expectCellToHavePiece("C0")("Black")(page)

  await endTurn(page)
  await expectCellToHavePiece("A3")("Black")(page)
  await expectCellToHavePiece("B2")("Black")(page)
  await expectCellToHavePiece("C1")("Black")(page)
  await expectCellToHavePiece("C3")("White")(page)

  // ---- Turn 4 White

  await expectTurnCountToBe(4)(page)
  await expectCurrentPlayerToBe("White")(page)
  await selectNthCard(0)(page)
  await selectCell("D4")(page)
  await expectCellToHavePiece("D4")("White")(page)

  await endTurn(page)
  await expectCellToHavePiece("A3")("Black")(page)
  await expectCellToHavePiece("B2")("Black")(page)
  await expectCellToHavePiece("C1")("Black")(page)
  await expectCellToHavePiece("C2")("White")(page)
  await expectCellToHavePiece("D3")("White")(page)

  // ---- Turn 4 Black

  await expectTurnCountToBe(4)(page)
  await expectCurrentPlayerToBe("Black")(page)
  await selectNthCard(0)(page)
  await selectCell("D0")(page)
  await expectCellToHavePiece("D0")("Black")(page)

  await endTurn(page)
  await expectCellToHavePiece("A4")("Black")(page)
  await expectCellToHavePiece("B3")("Black")(page)
  await expectCellToHavePiece("C2")("Black")(page)
  await expectCellToHavePiece("D1")("Black")(page)
  await expectCellToHavePiece("D3")("White")(page)

  // ---- Turn 5 White

  await expectTurnCountToBe(5)(page)
  await expectCurrentPlayerToBe("White")(page)

  await endTurn(page)
  await expectCellToHavePiece("A4")("Black")(page)
  await expectCellToHavePiece("B3")("Black")(page)
  await expectCellToHavePiece("C2")("Black")(page)
  await expectCellToHavePiece("D1")("Black")(page)

  // ---- Turn 5 Black

  await expectTurnCountToBe(5)(page)
  await expectCurrentPlayerToBe("Black")(page)

  await endTurn(page)
  await expectHegemonyToBe({ hegemonyWhite: 0, hegemonyBlack: 1 })(page)
  await expectCellToHavePiece("B4")("Black")(page)
  await expectCellToHavePiece("C3")("Black")(page)
  await expectCellToHavePiece("D2")("Black")(page)
})
