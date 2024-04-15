import { expect, test } from "bun:test"

import { gameFactory } from "../../factories"

import { Board } from "./board"
import * as Game from "./game"
import * as Player from "./player"

// ---- Board ----

test("Game.progressBoard - It progress the correct pieces forward", () => {
  const gameWhite: Game.Game = buildGame("White")(
    `
-p---
-----
-----
-----
---P-
`,
  )

  const gameBlack: Game.Game = buildGame("Black")(
    `
-p---
-----
-----
-----
---P-
`,
  )

  const expectedWhite: Game.Game = buildGame("White")(
    `
-p---
-----
-----
---P-
-----
`,
  )

  const expectedBlack: Game.Game = buildGame("Black")(
    `
-----
-p---
-----
-----
---P-
`,
  )

  const resultWhite = Game.progressBoard(gameWhite)
  const resultBlack = Game.progressBoard(gameBlack)

  expectGameBoardToMatch(resultWhite, expectedWhite)
  expectGameBoardToMatch(resultBlack, expectedBlack)
})

test("Game.addPiece - adds a piece", () => {
  const gameWhite: Game.Game = buildGame("White")(
    `
-p---
-----
-----
-----
---P-
`,
  )

  const pos1 = { rowIdx: 4, colIdx: 0 }

  const expected1: Game.Game = buildGame("White")(
    `
-p---
-----
-----
-----
P--P-
`,
  )

  const result1 = Game.addPiece(pos1.rowIdx)(pos1.colIdx)(gameWhite)

  expectGameBoardToMatch(result1, expected1)
})

test("Game.movePiece - it moves a piece", () => {
  const game: Game.Game = buildGame("White")(
    `
-p---
-----
-----
-----
---P-
`,
  )

  const posFrom = { rowIdx: 4, colIdx: 3 }
  const posTo = { rowIdx: 3, colIdx: 3 }

  const expected1: Game.Game = buildGame("White")(
    `
-p---
-----
-----
---P-
-----
`,
  )

  const result1 = Game.movePiece(posFrom)(posTo)(game)

  expectGameBoardToMatch(result1, expected1)
})

const expectGameBoardToMatch = (gameA: Game.Game, gameB: Game.Game): void => {
  const gameAText = Game.show(gameA)
  const gameBText = Game.show(gameB)

  expect(gameAText).toBe(gameBText)
}

const buildGame =
  (player: Player.Player) =>
  (boardStr: string): Game.Game => {
    const board = Board.parse(boardStr)
    const game: Game.Game = gameFactory.build({
      board,
      currentPlayer: player,
    })

    return game
  }
