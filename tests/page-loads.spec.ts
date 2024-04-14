import { expect, test } from "@playwright/test"

test("page loads", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await expect(page).toHaveTitle(/Zappalino/)
})

test("start game", async ({ page }) => {
  await page.goto("http://localhost:3000")

  await page.getByTestId("start-game-button").click()

  await expect(page.getByTestId("game-board")).toBeVisible()
})
