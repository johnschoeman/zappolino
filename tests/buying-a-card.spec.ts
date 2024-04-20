import { test } from "@playwright/test"

import { Supply } from "@app/model"

import {
  endTurn,
  expectCurrentPlayerToBe,
  expectDiscardCountToBe,
  expectNthSupplyToHaveCount,
  expectTurnPointsToBe,
  selectCommitResourceMat,
  selectNthCard,
  selectNthSupply,
  startGame,
} from "./testHelpers"

test("acquire a card from supply", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await startGame(page)

  const initialSupplySize = Supply.SUPPLY_SIZE

  await expectCurrentPlayerToBe("White")(page)
  await expectDiscardCountToBe(0)(page)
  await expectTurnPointsToBe({
    strategyPoints: 1,
    tacticPoints: 1,
    resourcePoints: 0,
  })(page)
  await expectNthSupplyToHaveCount(0)(initialSupplySize)(page)

  // ---- If the player hasn't committed enough resources
  // ---- It does not allow gaining the card
  await selectNthSupply(0)(page)

  await expectNthSupplyToHaveCount(0)(initialSupplySize)(page)
  await expectDiscardCountToBe(0)(page)
  await expectTurnPointsToBe({
    strategyPoints: 1,
    tacticPoints: 1,
    resourcePoints: 0,
  })(page)

  // ---- If the player commits enough resources
  // ---- It allows the player to gain the card
  await selectNthCard(0)(page)
  await selectCommitResourceMat(page)

  await expectTurnPointsToBe({
    strategyPoints: 1,
    tacticPoints: 1,
    resourcePoints: 1,
  })(page)

  await selectNthSupply(0)(page)

  const nextSupplySize = Supply.SUPPLY_SIZE - 1
  await expectNthSupplyToHaveCount(0)(nextSupplySize)(page)
  await expectDiscardCountToBe(1)(page)
  await expectTurnPointsToBe({
    strategyPoints: 1,
    tacticPoints: 1,
    resourcePoints: 0,
  })(page)

  await endTurn(page)

  await expectCurrentPlayerToBe("Black")(page)
})
