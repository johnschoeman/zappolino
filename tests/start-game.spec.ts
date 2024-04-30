import { test } from "@playwright/test"

import {
  checkSupplyPile,
  expectDrawPileSize,
  expectHandCount,
  expectSupplyPile,
  expectSupplyPileCount,
  expectToHaveHandSize,
  expectTurnPointsToBe,
  resetStartingHandCards,
  resetSupplyPile,
  setStartingHandCard,
  setStartingHandSize,
  startGame,
} from "./testHelpers"

test("starting a game - allows player to select starting hand and supply cards", async ({
  page,
}) => {
  await page.goto("http://localhost:3000")

  await resetStartingHandCards(page)
  await setStartingHandCard("DeployHoplite")(2)(page)
  await setStartingHandCard("ManeuverForward")(1)(page)
  await setStartingHandCard("ManeuverLeft")(1)(page)
  await setStartingHandCard("ManeuverRight")(0)(page)

  await setStartingHandSize(3)(page)

  await resetSupplyPile(page)
  await checkSupplyPile("DeployHoplite")(page)

  await startGame(page)

  await expectToHaveHandSize(3)(page)
  await expectHandCount("DeployHoplite")(1)(page)
  await expectHandCount("ManeuverForward")(1)(page)
  await expectHandCount("ManeuverLeft")(1)(page)
  await expectHandCount("ManeuverRight")(0)(page)

  await expectDrawPileSize(1)(page)

  await expectSupplyPileCount(1)(page)
  await expectSupplyPile("DeployHoplite")(page)

  await expectTurnPointsToBe({
    rescPts: 0,
    strtPts: 1,
    tactPts: 1,
    hoplPts: 1,
    drawPts: 0,
  })(page)
})
