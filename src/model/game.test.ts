import { expect, test } from "bun:test"

import { gameFactory } from "../../factories"

import * as Board from "./board"
import * as Game from "./game"
import * as Player from "./player"

test("Game.progress - It progress the correct pieces forward and changes the current player", () => {
  const game1: Game.Game = buildGame("White")(
    `
-p---
-----
-----
-----
---P-
`,
  )

  const game2: Game.Game = buildGame("Black")(
    `
-p---
-----
-----
---P-
-----
`,
  )

  const game3: Game.Game = buildGame("White")(
    `
-----
-p---
-----
---P-
-----
`,
  )

  const resultA = Game.progress(game1)
  const resultB = Game.progress(game2)

  expectGameToMatch(resultA, game2)
  expectGameToMatch(resultB, game3)
})

test("Game.addPiece - it only allows new pieces on the home row", () => {
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

  expectGameToMatch(result1, expected1)

  const pos2 = { rowIdx: 3, colIdx: 0 }

  const expected2: Game.Game = buildGame("White")(
    `
-p---
-----
-----
-----
---P-
`,
  )

  const result2 = Game.addPiece(pos2.rowIdx)(pos2.colIdx)(gameWhite)

  expectGameToMatch(result2, expected2)

  const pos3 = { rowIdx: 0, colIdx: 2 }

  const expected3: Game.Game = buildGame("Black")(
    `
-pp--
-----
-----
-----
---P-
`,
  )

  const result3 = Game.addPiece(pos3.rowIdx)(pos3.colIdx)(gameBlack)

  expectGameToMatch(result3, expected3)
})

const expectGameToMatch = (gameA: Game.Game, gameB: Game.Game): void => {
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
