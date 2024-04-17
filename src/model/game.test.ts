import { expect, test } from "bun:test"
import { Either, Option } from "effect"

import { deckFactory, gameFactory } from "../../factories"

import { Board } from "./board"
import { Card, Deck } from "./deck"
import * as Game from "./game"
import * as Player from "./player"
import * as Supply from "./supply"

// ---- End Turn ----

test("Game.endTurn - It discards, draws a new hand, progress the board and switches players", () => {
  const boardStr = `
-p---
-----
-----
-----
---P-
`
  const board = Board.parse(boardStr)
  const player = "White"
  const deckWhite = deckFactory.build({
    hand: ["DeployHoplite", "DeployHoplite", "DeployHoplite", "DeployHoplite", "DeployHoplite"],
    draw: [
      "MoveForward",
      "MoveForward",
      "MoveForward",
      "MoveForward",
      "MoveForward",
    ],
    disc: [],
    playedCards: ["MoveRight"],
  })
  const deckBlack = deckFactory.build({
    hand: [],
    draw: [],
    disc: [],
  })

  const game: Game.Game = gameFactory.build({
    board,
    currentPlayer: player,
    deckWhite,
    deckBlack,
    turnPoints: {
      strategyPoints: 0,
      tacticPoints: 0,
    },
  })

  const result = Game.endTurn(game)

  const expectedBoardStr = `
-p---
-----
-----
---P-
-----
`
  const expectedBoard = Board.parse(expectedBoardStr)
  const expectedDeckWhite: Deck.Deck = {
    hand: [
      "MoveForward",
      "MoveForward",
      "MoveForward",
      "MoveForward",
      "MoveForward",
    ],
    draw: [],
    disc: ["DeployHoplite", "DeployHoplite", "DeployHoplite", "DeployHoplite", "DeployHoplite", "MoveRight"],
    playedCards: [],
  }

  const expected: Game.Game = {
    currentPlayer: "Black",
    board: expectedBoard,
    selectedCardIdx: Option.none(),
    deckWhite: expectedDeckWhite,
    deckBlack,
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 1,
    },
    supply: Supply.initial,
  }

  expect(result).toEqual(expected)
})

// ---- Select Cell ----

test("Game.selectCell - when making a valid move, it plays the selected card", () => {
  const boardStr = `
-p---
-----
-----
-----
---P-
`
  const board = Board.parse(boardStr)
  const player = "White"
  const deckWhite = deckFactory.build({
    playedCards: ["MoveRight"],
    hand: ["DeployHoplite", "MoveLeft"],
    draw: ["DeployHoplite", "MoveForward"],
    disc: [],
  })
  const deckBlack = deckFactory.build({
    hand: [],
    draw: [],
    disc: [],
  })

  const game: Game.Game = gameFactory.build({
    board,
    selectedCardIdx: Option.some(0),
    currentPlayer: player,
    deckWhite,
    deckBlack,
  })

  const pos = { rowIdx: 4, colIdx: 0 }
  const result = Game.selectCell(pos)(game)

  const expectedBoardStr = `
-p---
-----
-----
-----
P--P-
`
  const expectedBoard = Board.parse(expectedBoardStr)
  const expectedDeckWhite: Deck.Deck = {
    playedCards: ["MoveRight", "DeployHoplite"],
    hand: ["MoveLeft"],
    draw: ["DeployHoplite", "MoveForward"],
    disc: [],
  }

  const expected: Game.Game = {
    currentPlayer: "White",
    board: expectedBoard,
    selectedCardIdx: Option.none(),
    deckWhite: expectedDeckWhite,
    deckBlack,
    turnPoints: {
      tacticPoints: 1,
      strategyPoints: 0,
    },
    supply: Supply.initial,
  }

  expect(result).toEqual(expected)
})

// ---- Select Hand Card ----

test("Game.selectHandCard", () => {})

// ---- Select Supply Pile ----

test("Game.selectSupplyPile - It consumes a strategy point and adds a card to the players discard", () => {
  const player = "White"
  const deckWhite = deckFactory.build({
    playedCards: [],
    hand: ["DeployHoplite", "MoveLeft"],
    draw: ["DeployHoplite", "MoveForward"],
    disc: [],
  })

  const supply: Supply.Supply = [{ card: "DeployHoplite", count: 1 }]

  const game: Game.Game = gameFactory.build({
    currentPlayer: player,
    deckWhite,
    supply,
  })

  const result = Game.selectSupplyPile(0)(game)

  const expectedDeckWhite: Deck.Deck = {
    playedCards: [],
    hand: ["DeployHoplite", "MoveLeft"],
    draw: ["DeployHoplite", "MoveForward"],
    disc: ["DeployHoplite"],
  }
  const expectedSupply: Supply.Supply = [{ card: "DeployHoplite", count: 0 }]

  const expected: Game.Game = gameFactory.build({
    currentPlayer: "White",
    deckWhite: expectedDeckWhite,
    turnPoints: {
      tacticPoints: 1,
      strategyPoints: 0,
    },
    supply: expectedSupply,
  })

  expect(result).toEqual(expected)
})

test("Game.selectSupplyPile - If the supply count is 0, it does nothing", () => {
  const player = "White"
  const deckWhite = deckFactory.build({
    playedCards: [],
    hand: ["DeployHoplite", "MoveLeft"],
    draw: ["DeployHoplite", "MoveForward"],
    disc: [],
  })

  const supply: Supply.Supply = [{ card: "DeployHoplite", count: 0 }]

  const game: Game.Game = gameFactory.build({
    currentPlayer: player,
    deckWhite,
    supply,
  })

  const result = Game.selectSupplyPile(0)(game)

  const expectedDeckWhite: Deck.Deck = {
    playedCards: [],
    hand: ["DeployHoplite", "MoveLeft"],
    draw: ["DeployHoplite", "MoveForward"],
    disc: [],
  }
  const expectedSupply: Supply.Supply = [{ card: "DeployHoplite", count: 0 }]

  const expected: Game.Game = gameFactory.build({
    currentPlayer: "White",
    deckWhite: expectedDeckWhite,
    turnPoints: {
      tacticPoints: 1,
      strategyPoints: 1,
    },
    supply: expectedSupply,
  })

  expect(result).toEqual(expected)
})

test("Game.selectSupplyPile - If the player has no strategy points, it does nothing", () => {
  const player = "White"
  const deckWhite = deckFactory.build({
    playedCards: [],
    hand: ["DeployHoplite", "MoveLeft"],
    draw: ["DeployHoplite", "MoveForward"],
    disc: [],
  })

  const supply: Supply.Supply = [{ card: "DeployHoplite", count: 1 }]

  const game: Game.Game = gameFactory.build({
    currentPlayer: player,
    turnPoints: {
      tacticPoints: 1,
      strategyPoints: 0,
    },
    deckWhite,
    supply,
  })

  const result = Game.selectSupplyPile(0)(game)

  const expectedDeckWhite: Deck.Deck = {
    playedCards: [],
    hand: ["DeployHoplite", "MoveLeft"],
    draw: ["DeployHoplite", "MoveForward"],
    disc: [],
  }
  const expectedSupply: Supply.Supply = [{ card: "DeployHoplite", count: 1 }]

  const expected: Game.Game = gameFactory.build({
    currentPlayer: "White",
    deckWhite: expectedDeckWhite,
    turnPoints: {
      tacticPoints: 1,
      strategyPoints: 0,
    },
    supply: expectedSupply,
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

test("Game.validateHasCardCost - if the player has the points, it returns the game, and error if not", () => {
  const strategyCard: Card.Card = "DeployHoplite"
  const tacticCard: Card.Card = "MoveLeft"

  const game1 = gameFactory.build({
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 1,
    },
  })

  const game2 = gameFactory.build({
    turnPoints: {
      strategyPoints: 0,
      tacticPoints: 0,
    },
  })

  const result1 = Game.validateHasCardCost(strategyCard)(game1)
  const result2 = Game.validateHasCardCost(tacticCard)(game1)
  const result3 = Game.validateHasCardCost(strategyCard)(game2)
  const result4 = Game.validateHasCardCost(tacticCard)(game2)

  expect(result1).toEqual(Either.right(game1))
  expect(result2).toEqual(Either.right(game1))
  expect(result3).toEqual(Either.left("NotEnoughStrategyPoints"))
  expect(result4).toEqual(Either.left("NotEnoughTacticPoints"))
})

test("Game.playDeployHoplitePieceCard - it only allows valid placement", () => {
  const player = "White"
  const board = Board.parse(
    `
-p---
-----
-----
-----
---P-
`,
  )
  const game: Game.Game = gameFactory.build({
    board,
    currentPlayer: player,
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 1,
    },
  })

  const posValid = { rowIdx: 4, colIdx: 0 }
  const posNotOnHomeRow = { rowIdx: 3, colIdx: 0 }
  const posOnExistingPiece = { rowIdx: 4, colIdx: 3 }

  const expectedBoard = Board.parse(
    `
-p---
-----
-----
-----
P--P-
`,
  )
  const expected1: Game.Game = gameFactory.build({
    board: expectedBoard,
    currentPlayer: "White",
    turnPoints: {
      strategyPoints: 0,
      tacticPoints: 1,
    },
  })

  const result1 = Game.playDeployHoplitePieceCard(posValid)(game)
  const result2 = Game.playDeployHoplitePieceCard(posNotOnHomeRow)(game)
  const result3 = Game.playDeployHoplitePieceCard(posOnExistingPiece)(game)

  expect(result1).toEqual(Either.right(expected1))
  expect(result2).toEqual(Either.left("InvalidPlacement"))
  expect(result3).toEqual(Either.left("InvalidPlacement"))
})

test("Game.playMoveForwardCard - it moves the select piece forward", () => {
  const player = "White"
  const board = Board.parse(
    `
----P
-p---
P----
P----
---P-
`,
  )
  const game: Game.Game = gameFactory.build({
    board,
    currentPlayer: player,
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 1,
    },
  })

  const posValid = { rowIdx: 4, colIdx: 3 }
  const posNoPiece = { rowIdx: 4, colIdx: 0 }
  const posOtherPlayerPiece = { rowIdx: 1, colIdx: 1 }
  const posOnToOwnPiece = { rowIdx: 3, colIdx: 0 }
  const posMoveOffBoard = { rowIdx: 0, colIdx: 4 }

  const expectedBoard = Board.parse(
    `
----P
-p---
P----
P--P-
-----
`,
  )
  const expected1: Game.Game = gameFactory.build({
    board: expectedBoard,
    currentPlayer: "White",
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 0,
    },
  })

  const result1 = Game.playMoveForwardCard(posValid)(game)
  const result2 = Game.playMoveForwardCard(posNoPiece)(game)
  const result3 = Game.playMoveForwardCard(posOtherPlayerPiece)(game)
  const result4 = Game.playMoveForwardCard(posOnToOwnPiece)(game)
  const result5 = Game.playMoveForwardCard(posMoveOffBoard)(game)

  expect(result1).toEqual(Either.right(expected1))
  expect(result2).toEqual(Either.left("InvalidPieceSelection"))
  expect(result3).toEqual(Either.left("InvalidPieceSelection"))
  expect(result4).toEqual(Either.left("InvalidDestination"))
  expect(result5).toEqual(Either.left("InvalidDestination"))
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
