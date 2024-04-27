import { expect, test } from "@playwright/test"

import { Card } from "@app/model"

import { startGame } from "./testHelpers"

test("card renders correctly", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await startGame(page)

  const cardEl = page.getByTestId(`${Card.show("Oracle")}`)

  await expect(cardEl).toContainText("+ 1 Strategy")
  await expect(cardEl).toContainText("+ 2 Tactics")
  await expect(cardEl).toContainText("Cost: 5")
  await expect(cardEl).toContainText("Resource: 3")
})
