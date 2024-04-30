import { expect, Page } from "@playwright/test"

import { Card, Cell, Game, Player, PointsPool, Position } from "@app/model"

// ---- Workflows

export const resetStartingHandCards = async (page: Page): Promise<void> => {
  await setStartingHandCard("DeployHoplite")(0)(page)
  await setStartingHandCard("ManeuverForward")(0)(page)
  await setStartingHandCard("ManeuverLeft")(0)(page)
  await setStartingHandCard("ManeuverRight")(0)(page)
}

export const setStartingHandCard =
  (card: Card.Card) =>
  (count: number) =>
  async (page: Page): Promise<void> => {
    await page.getByTestId(`starting-hand-${Card.show(card)}`).fill(`${count}`)
  }

export const setStartingHandSize =
  (count: number) =>
  async (page: Page): Promise<void> => {
    await page.getByTestId("starting-hand-size").fill(`${count}`)
  }

export const resetSupplyPile = async (page: Page): Promise<void> => {
  await page.getByTestId("starting-supply-uncheck-all").click()
}

export const checkSupplyPile =
  (card: Card.Card) =>
  async (page: Page): Promise<void> => {
    await page.getByTestId(`starting-supply-pile-${Card.show(card)}`).check()
  }

export const uncheckSupplyPile =
  (card: Card.Card) =>
  async (page: Page): Promise<void> => {
    await page
      .getByTestId(`starting-supply-pile-${Card.show(card)}`)
      .uncheck({ force: true })
  }

export const startGame = async (page: Page): Promise<void> => {
  await page.getByTestId("start-game-button").click()
  await expect(page.getByTestId("game-board")).toBeVisible()
}

export const endGame = async (page: Page): Promise<void> => {
  await page.getByTestId("end-game-button").click()
  await expect(page.getByTestId("start-game-button")).toBeVisible()
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

export const selectDrawPile = async (page: Page): Promise<void> => {
  await page.getByTestId("draw-pile").click()
}

export const selectPlayMat = async (page: Page): Promise<void> => {
  await page.getByTestId("play-mat").click()
}

export const selectCommitResourceMat = async (page: Page): Promise<void> => {
  await page.getByTestId("commit-resource-mat").click()
}

export const selectCell =
  (rankFileStr: string) =>
  async (page: Page): Promise<void> => {
    const rankFile = Position.parseRankFile(rankFileStr)
    const testId = Position.showRankFile(rankFile)
    await page.getByTestId(testId).click()
  }

export const selectHomeRowCell =
  (player: Player.Player, file: Position.File) =>
  async (page: Page): Promise<void> => {
    const rankFile = Position.buildRankFile(Player.homeRank(player), file)
    const testId = Position.showRankFile(rankFile)
    await page.getByTestId(testId).click()
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
  (rankFileStr: string) =>
  (player: Player.Player) =>
  async (page: Page): Promise<void> => {
    const rankFile = Position.parseRankFile(rankFileStr)
    const testId = Position.showRankFile(rankFile)
    await expect(page.getByTestId(testId)).toHaveAttribute(
      "data-cell",
      Cell.show({ _tag: "Piece", player }),
    )
  }

export const expectCellToBeEmpty =
  (rankFileStr: string) =>
  async (page: Page): Promise<void> => {
    const rankFile = Position.parseRankFile(rankFileStr)
    const testId = Position.showRankFile(rankFile)
    await expect(page.getByTestId(testId)).toHaveAttribute(
      "data-cell",
      Cell.show(Cell.empty),
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
  ({ hoplPts, strtPts, tactPts, rescPts, drawPts }: PointsPool.PointsPool) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId("hopl-pts-count")).toHaveText(`${hoplPts}`)
    await expect(page.getByTestId("tact-pts-count")).toHaveText(`${tactPts}`)
    await expect(page.getByTestId("strt-pts-count")).toHaveText(`${strtPts}`)
    await expect(page.getByTestId("resc-pts-count")).toHaveText(`${rescPts}`)
    await expect(page.getByTestId("draw-pts-count")).toHaveText(`${drawPts}`)
  }

export const expectSupplyPileCount =
  (count: number) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId(/supply-pile-card/)).toHaveCount(count)
  }

export const expectSupplyPile =
  (card: Card.Card) =>
  async (page: Page): Promise<void> => {
    await expect(
      page.getByTestId(`supply-pile-card-${Card.show(card)}`),
    ).toBeVisible()
  }

export const expectHandCount =
  (card: Card.Card) =>
  (count: number) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId(`hand-card-${Card.show(card)}`)).toHaveCount(
      count,
    )
  }

export const expectDrawPileSize =
  (count: number) =>
  async (page: Page): Promise<void> => {
    await expect(page.getByTestId("draw-pile-count")).toContainText(`${count}`)
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
