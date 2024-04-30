import { test } from "@playwright/test"

import {
  expectTurnPointsToBe,
  selectNthCard,
  selectPlayMat,
  startGame,
} from "./testHelpers"

test("play a draw card and draw new cards", async ({ page }) => {
  await page.goto("http://localhost:3000")

  // select Polis to be starting hand card
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
    strategyPoints: 1,
    tacticPoints: 1,
    placementPoints: 1,
  })(page)

  // select draw pile
  //
  // expect card to have been drawn
})
