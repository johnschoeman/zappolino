import { test } from "@playwright/test"

import {
  expectDrawPileSize,
  expectToHaveHandSize,
  expectTurnPointsToBe,
  resetStartingHandCards,
  selectDrawPile,
  selectNthCard,
  selectPlayMat,
  setStartingHandCard,
  setStartingHandSize,
  startGame,
} from "./testHelpers"

test("play a draw card and draw new cards", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await resetStartingHandCards(page)
  await setStartingHandCard("Polis")(2)(page)
  await setStartingHandSize(1)(page)
  await startGame(page)

  await expectTurnPointsToBe({
    rescPts: 0,
    strtPts: 1,
    tactPts: 1,
    hoplPts: 1,
    drawPts: 0,
  })(page)
  await expectDrawPileSize(1)(page)

  await selectNthCard(0)(page)
  await selectPlayMat(page)

  await expectTurnPointsToBe({
    rescPts: 0,
    strtPts: 2,
    tactPts: 1,
    hoplPts: 1,
    drawPts: 1,
  })(page)

  await selectDrawPile(page)

  await expectTurnPointsToBe({
    rescPts: 0,
    strtPts: 2,
    tactPts: 1,
    hoplPts: 1,
    drawPts: 0,
  })(page)

  await expectToHaveHandSize(1)(page)
  await expectDrawPileSize(0)(page)
})
