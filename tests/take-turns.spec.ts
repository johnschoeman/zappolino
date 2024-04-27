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
  selectHomeRowCell,
  selectNthCard,
  selectPlayMat,
  startGame,
} from "./testHelpers"

test("take a single turn - place a piece", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await startGame(page)

  await expectCurrentPlayerToBe("White")(page)
  await expectDiscardCountToBe(0)(page)
  await expectTurnPointsToBe({
    placementPoints: 1,
    strategyPoints: 1,
    tacticPoints: 1,
    resourcePoints: 0,
  })(page)
  await expectToHaveHandSize(5)(page)

  // ---- Start turn by placing a piece
  await selectHomeRowCell("White", "A")(page)
  await expectCellToHavePiece("A6")("White")(page)
  await expectTurnPointsToBe({
    placementPoints: 0,
    strategyPoints: 1,
    tacticPoints: 1,
    resourcePoints: 0,
  })(page)

  // ---- Select and play Deploy Hoplite card
  await selectNthCard(0)(page)
  await selectPlayMat(page)
  await expectTurnPointsToBe({
    placementPoints: 1,
    strategyPoints: 0,
    tacticPoints: 1,
    resourcePoints: 0,
  })(page)

  // ---- Place a piece
  await selectHomeRowCell("White", "B")(page)
  await expectCellToHavePiece("B6")("White")(page)
  await expectTurnPointsToBe({
    placementPoints: 0,
    strategyPoints: 0,
    tacticPoints: 1,
    resourcePoints: 0,
  })(page)

  await expectToHaveHandSize(4)(page)
  await expectPlayedCardSize(1)(page)

  await endTurn(page)

  await expectCellToHavePiece("A5")("White")(page)
  await expectCurrentPlayerToBe("Black")(page)
})

test("take many turns - progress the pieces on the board", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await startGame(page)
  await expectHegemonyToBe({ hegemonyWhite: 0, hegemonyBlack: 0 })(page)

  // // ---- Turn 1 White
  //
  // await expectTurnCountToBe(1)(page)
  // await expectCurrentPlayerToBe("White")(page)
  // await selectNthCard(0)(page)
  // await selectHomeRowCell("White", "A")(page)
  // await expectCellToHavePiece("A6")("White")(page)
  //
  // await endTurn(page)
  //
  // await expectCellToHavePiece("A5")("White")(page)
  //
  // // ---- Turn 1 Black
  //
  // await expectTurnCountToBe(1)(page)
  // await expectCurrentPlayerToBe("Black")(page)
  // await selectNthCard(0)(page)
  // await selectHomeRowCell("Black", "A")(page)
  // await expectCellToHavePiece("A0")("Black")(page)
  //
  // await endTurn(page)
  //
  // await expectCellToHavePiece("A1")("Black")(page)
  // await expectCellToHavePiece("A5")("White")(page)
  //
  // // ---- Turn 2 White
  //
  // await expectTurnCountToBe(2)(page)
  // await expectCurrentPlayerToBe("White")(page)
  // await selectNthCard(0)(page)
  // await selectHomeRowCell("White", "B")(page)
  // await expectCellToHavePiece("B6")("White")(page)
  //
  // await endTurn(page)
  // await expectCellToHavePiece("A1")("Black")(page)
  // await expectCellToHavePiece("A4")("White")(page)
  // await expectCellToHavePiece("B5")("White")(page)
  //
  // // ---- Turn 2 Black
  //
  // await expectTurnCountToBe(2)(page)
  // await expectCurrentPlayerToBe("Black")(page)
  // await selectNthCard(0)(page)
  // await selectHomeRowCell("Black", "B")(page)
  // await expectCellToHavePiece("B0")("Black")(page)
  //
  // await endTurn(page)
  // await expectCellToHavePiece("A2")("Black")(page)
  // await expectCellToHavePiece("B1")("Black")(page)
  // await expectCellToHavePiece("B5")("White")(page)
  //
  // // ---- Turn 3 White
  //
  // await expectTurnCountToBe(3)(page)
  // await expectCurrentPlayerToBe("White")(page)
  // await selectNthCard(0)(page)
  // await selectHomeRowCell("White", "C")(page)
  // await expectCellToHavePiece("C6")("White")(page)
  //
  // await endTurn(page)
  // await expectCellToHavePiece("A2")("Black")(page)
  // await expectCellToHavePiece("B1")("Black")(page)
  // await expectCellToHavePiece("B4")("White")(page)
  // await expectCellToHavePiece("C5")("White")(page)
  //
  // // ---- Turn 3 Black
  //
  // await expectTurnCountToBe(3)(page)
  // await expectCurrentPlayerToBe("Black")(page)
  // await selectNthCard(0)(page)
  // await selectHomeRowCell("Black", "C")(page)
  // await expectCellToHavePiece("C0")("Black")(page)
  //
  // await endTurn(page)
  // await expectCellToHavePiece("A3")("Black")(page)
  // await expectCellToHavePiece("B2")("Black")(page)
  // await expectCellToHavePiece("C1")("Black")(page)
  // await expectCellToHavePiece("C5")("White")(page)
  //
  // // ---- Turn 4 White
  //
  // await expectTurnCountToBe(4)(page)
  // await expectCurrentPlayerToBe("White")(page)
  // await selectNthCard(0)(page)
  // await selectHomeRowCell("White", "D")(page)
  // await expectCellToHavePiece("D6")("White")(page)
  //
  // await endTurn(page)
  // await expectCellToHavePiece("A3")("Black")(page)
  // await expectCellToHavePiece("B2")("Black")(page)
  // await expectCellToHavePiece("C1")("Black")(page)
  // await expectCellToHavePiece("C4")("White")(page)
  // await expectCellToHavePiece("D5")("White")(page)
  //
  // // ---- Turn 4 Black
  //
  // await expectTurnCountToBe(4)(page)
  // await expectCurrentPlayerToBe("Black")(page)
  // await selectNthCard(0)(page)
  // await selectHomeRowCell("Black", "D")(page)
  // await expectCellToHavePiece("D0")("Black")(page)
  //
  // await endTurn(page)
  // await expectCellToHavePiece("A4")("Black")(page)
  // await expectCellToHavePiece("B3")("Black")(page)
  // await expectCellToHavePiece("C2")("Black")(page)
  // await expectCellToHavePiece("D1")("Black")(page)
  // await expectCellToHavePiece("D5")("White")(page)
  //
  // // ---- Turn 5 White
  //
  // await expectTurnCountToBe(5)(page)
  // await expectCurrentPlayerToBe("White")(page)
  //
  // await endTurn(page)
  // await expectCellToHavePiece("A4")("Black")(page)
  // await expectCellToHavePiece("B3")("Black")(page)
  // await expectCellToHavePiece("C2")("Black")(page)
  // await expectCellToHavePiece("D1")("Black")(page)
  //
  // // ---- Turn 5 Black
  //
  // await expectTurnCountToBe(5)(page)
  // await expectCurrentPlayerToBe("Black")(page)
  //
  // await endTurn(page)
  // await expectHegemonyToBe({ hegemonyWhite: 0, hegemonyBlack: 1 })(page)
  // await expectCellToHavePiece("B4")("Black")(page)
  // await expectCellToHavePiece("C3")("Black")(page)
  // await expectCellToHavePiece("D2")("Black")(page)
})
