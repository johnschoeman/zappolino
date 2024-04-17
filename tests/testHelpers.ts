import { expect, Page } from "@playwright/test"

import { Cell, Player, Position, Game } from "@app/model"

// ---- Workflows

export const startGame = async (page: Page): Promise<void> => {
  await page.getByTestId("start-game-button").click()
  await expect(page.getByTestId("game-board")).toBeVisible()
}

export const endTurn = async (page: Page): Promise<void> => {
  await page.getByTestId("end-turn-button").click()
}

export const selectNthCard =
  (cardIdx: number) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId(`unplayed-card-${cardIdx}`)).not.toHaveClass(
      /selected/,
    )
    await page.getByTestId(`unplayed-card-${cardIdx}`).click()
    await expect(page.getByTestId(`unplayed-card-${cardIdx}`)).toHaveClass(
      /selected/,
    )
  }

export const selectPlayMat = async (page: Page): Promise<void> => {
  await page.getByTestId("play-mat").click()
}

export const selectCell =
  (rankFile: Position.RankFile) =>
  async (page: Page): Promise<void> => {
    await page.getByTestId(rankFile).click()
  }

export const selectNthSupply =
  (supplyIdx: number) =>
  async (page: Page): Promise<void> => {
    await page.getByTestId(`supply-pile-${supplyIdx}`).click()
  }

export const expectNthSupplyToHaveCount =
  (supplyIdx: number) =>
  (count: number) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId(`supply-pile-${supplyIdx}-count`)).toHaveText(
      `${count}`,
    )
  }

// ---- Expectations

export const expectCellToHavePiece =
  (rankFile: Position.RankFile) =>
  (player: Player.Player) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId(rankFile)).toHaveAttribute(
      "data-cell",
      Cell.show({ _tag: "Piece", player }),
    )
  }

export const expectHegemonyToBe =
  ({ hegemonyWhite, hegemonyBlack }: Game.Hegemony) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId("hegemony-white")).toContainText(
      `${hegemonyWhite}`,
    )
    await expect(page.getByTestId("hegemony-black")).toContainText(
      `${hegemonyBlack}`,
    )
  }

export const expectCurrentPlayerToBe =
  (player: Player.Player) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId("current-player")).toContainText(
      Player.toLabel(player),
    )
  }

export const expectTurnCountToBe =
  (count: number) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId("turn-count")).toContainText(`${count}`)
  }

export const expectDiscardCountToBe =
  (count: number) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId("discard-pile-count")).toHaveText(`${count}`)
  }

export const expectTurnPointsToBe =
  ({ strategyPoints, tacticPoints, resourcePoints }: Game.TurnPoints) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId("tactic-count")).toHaveText(`${tacticPoints}`)
    await expect(page.getByTestId("strategy-count")).toHaveText(
      `${strategyPoints}`,
    )
    await expect(page.getByTestId("resource-count")).toHaveText(
      `${resourcePoints}`,
    )
  }

export const expectToHaveHandSize =
  (count: number) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId(/unplayed-card/)).toHaveCount(count)
  }

export const expectPlayedCardSize =
  (count: number) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId(/consumed-card/)).toHaveCount(count)
  }
