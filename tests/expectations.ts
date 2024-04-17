import { expect, Page } from "@playwright/test"
import { Cell, Player } from "../src/model"

export const expectCellToHavePiece =
  (page: Page) =>
  (cellId: string) =>
  async (player: Player.Player): Promise<void> => {
    await expect(page.getByTestId(cellId)).toHaveAttribute(
      "data-cell",
      Cell.show({ _tag: "Piece", player }),
    )
  }

export const expectCurrentPlayerToBe =
  (page: Page) =>
  async (player: Player.Player): Promise<void> => {
    await expect(page.getByTestId("current-player")).toHaveText(
      Player.show(player),
    )
  }
