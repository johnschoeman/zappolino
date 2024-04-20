import { expect, test } from "bun:test"
import { Option } from "effect"

import { deckFactory, gameFactory } from "../../factories"

import { Board } from "./board"
import * as Game from "./game"
import * as Player from "./player"

test("Game.commitSelectedCard", () => {
  const deck = deckFactory.build({
    hand: ["DeployHoplite"],
    commitedCards: [],
  })
  const game: Game.Game = gameFactory.build({
    currentPlayer: "White",
    deckWhite: deck,
    selectedCardIdx: Option.some(0),
    turnPoints: {
      resourcePoints: 0,
      strategyPoints: 0,
      tacticPoints: 0,
    },
  })

  const result = Game.commitSelectedCard(game)

  const expectedDeck = deckFactory.build({
    hand: [],
    commitedCards: ["DeployHoplite"],
  })
  const expected = gameFactory.build({
    currentPlayer: "White",
    deckWhite: expectedDeck,
    turnPoints: {
      resourcePoints: 1,
      strategyPoints: 0,
      tacticPoints: 0,
    },
  })

  expect(result).toEqual(expected)
})

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

test("Game.progressBoard - When the piece crosses the board, it increments the score", () => {
  const gameWhite: Game.Game = buildGame("White")(
    `
-P---
-----
-----
-----
---p-
`,
  )

  const gameBlack: Game.Game = buildGame("Black")(
    `
-P---
-----
-----
-----
---p-
`,
  )

  const expectedWhite: Game.Game = buildGame("White")(
    `
-----
-----
-----
-----
---p-
`,
  )

  const expectedBlack: Game.Game = buildGame("Black")(
    `
-P---
-----
-----
-----
-----
`,
  )

  const resultWhite = Game.progressBoard(gameWhite)
  const resultBlack = Game.progressBoard(gameBlack)

  expectGameBoardToMatch(resultWhite, expectedWhite)
  expect(resultWhite.hegemony.hegemonyWhite).toBe(1)
  expectGameBoardToMatch(resultBlack, expectedBlack)
  expect(resultBlack.hegemony.hegemonyBlack).toBe(1)
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
