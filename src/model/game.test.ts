import { expect, test } from "bun:test"
import { Array, Option, pipe } from "effect"

import { deckFactory, gameFactory } from "../../factories"

import { Board, Cell } from "./board"
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
      rescPts: 0,
      strtPts: 0,
      tactPts: 0,
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
      rescPts: 1,
      strtPts: 0,
      tactPts: 0,
    },
  })

  expect(result).toEqual(expected)
})

// ---- Board ----

test("Game.progressColumn", () => {
  const column1 = parseColumn("--pP----")
  const column2 = parseColumn("--pPP---")
  const column3 = parseColumn("--pPP--P")

  const column4 = parseColumn("--pPP---")
  const column5 = parseColumn("pppPP---")

  const result1 = Game.progressColumn("White")(column1)
  const result2 = Game.progressColumn("White")(column2)
  const result3 = Game.progressColumn("White")(column3)

  const result4 = Game.progressColumn("Black")(column4)
  const result5 = Game.progressColumn("Black")(column5)

  const expected1: Game.ColumnProgression = [parseColumn("--pP----"), 0]
  const expected2: Game.ColumnProgression = [parseColumn("--PP----"), 1]
  const expected3: Game.ColumnProgression = [parseColumn("--PP--P-"), 1]

  const expected4: Game.ColumnProgression = [parseColumn("--pPP---"), 0]
  const expected5: Game.ColumnProgression = [parseColumn("-pppP---"), 1]

  expectColumnToMatch(result1, expected1)
  expectColumnToMatch(result2, expected2)
  expectColumnToMatch(result3, expected3)

  expectColumnToMatch(result4, expected4)
  expectColumnToMatch(result5, expected5)
})

const parseColumn = (str: string): Board.Column<Cell.Cell> => {
  return Board.parseColumn(str)
}

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

test("Game.progressBoard - when a piece is taken, it adds a point", () => {
  const gameWhite: Game.Game = buildGame("White")(
    `
-----
-----
--p--
--P--
--P--
-----
-----
`,
  )

  const gameBlack: Game.Game = buildGame("Black")(
    `
-----
-----
--p--
--p--
--P--
-----
-----
`,
  )

  const expectedWhite: Game.Game = buildGame("White")(
    `
-----
-----
--P--
--P--
-----
-----
-----
`,
  )

  const expectedBlack: Game.Game = buildGame("Black")(
    `
-----
-----
-----
--p--
--p--
-----
-----
`,
  )

  const resultWhite = Game.progressBoard(gameWhite)
  const resultBlack = Game.progressBoard(gameBlack)

  expectGameBoardToMatch(resultWhite, expectedWhite)
  expect(resultWhite.hegemony.hegemonyWhite).toBe(1)
  expect(resultWhite.hegemony.hegemonyBlack).toBe(0)

  expectGameBoardToMatch(resultBlack, expectedBlack)
  expect(resultBlack.hegemony.hegemonyWhite).toBe(0)
  expect(resultBlack.hegemony.hegemonyBlack).toBe(1)
})

test("Game.progressBoard - When the piece enters the opponents home row, it increments the score and removes the piece", () => {
  const gameWhite: Game.Game = buildGame("White")(
    `
-----
-P---
-----
-----
-----
---p-
-----
`,
  )

  const gameBlack: Game.Game = buildGame("Black")(
    `
-----
-P---
-----
-----
-----
---p-
-----
`,
  )

  const expectedWhite: Game.Game = buildGame("White")(
    `
-----
-----
-----
-----
-----
---p-
-----
`,
  )

  const expectedBlack: Game.Game = buildGame("Black")(
    `
-----
-P---
-----
-----
-----
-----
-----
`,
  )

  const resultWhite = Game.progressBoard(gameWhite)
  const resultBlack = Game.progressBoard(gameBlack)

  expectGameBoardToMatch(resultWhite, expectedWhite)
  expect(resultWhite.hegemony.hegemonyWhite).toBe(5)
  expectGameBoardToMatch(resultBlack, expectedBlack)
  expect(resultBlack.hegemony.hegemonyBlack).toBe(5)
})

test("Game.progressBoard - it progresses each column", () => {
  const gameWhite: Game.Game = buildGame("White")(
    `
-----
----p
--p-P
pppp-
PPP-P
-P-PP
-----
`,
  )

  const expectedWhite: Game.Game = buildGame("White")(
    `
-----
----p
--p-P
pPppP
PPPPP
-----
-----
`,
  )

  const resultWhite = Game.progressBoard(gameWhite)

  expectGameBoardToMatch(resultWhite, expectedWhite)
})

// ---- Game.addPiece

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

const expectColumnToMatch = (
  [colA, pointsA]: Game.ColumnProgression,
  [colB, pointsB]: Game.ColumnProgression,
): void => {
  const colAText = pipe(colA, Array.map(Cell.show), Array.join(""))
  const colBText = pipe(colB, Array.map(Cell.show), Array.join(""))

  expect(colAText).toEqual(colBText)
  expect(pointsA).toEqual(pointsB)
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
