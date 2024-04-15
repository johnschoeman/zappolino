import { expect, test } from "bun:test"
import { Option } from "effect"

import { deckFactory, gameFactory } from "../../factories"

import { Board } from "./board"
import { Deck } from "./deck"
import * as Game from "./game"
import * as GameAction from "./gameAction"
import * as Supply from "./supply"

// ---- End Turn ----

test("GameAction.endTurn - It discards, draws a new hand, progress the board and switches players", () => {
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
    hand: [
      "DeployHoplite",
      "DeployHoplite",
      "DeployHoplite",
      "DeployHoplite",
      "DeployHoplite",
    ],
    draw: [
      "ManeuverForward",
      "ManeuverForward",
      "ManeuverForward",
      "ManeuverForward",
      "ManeuverForward",
    ],
    disc: [],
    playedCards: ["ManeuverRight"],
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

  const result = GameAction.endTurn(game)

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
      "ManeuverForward",
      "ManeuverForward",
      "ManeuverForward",
      "ManeuverForward",
      "ManeuverForward",
    ],
    draw: [],
    disc: [
      "DeployHoplite",
      "DeployHoplite",
      "DeployHoplite",
      "DeployHoplite",
      "DeployHoplite",
      "ManeuverRight",
    ],
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
      resourcePoints: 0,
    },
    supply: Supply.initial,
    turnCount: 1,
    hegemonyBlack: 0,
    hegemonyWhite: 0,
  }

  expect(result).toEqual(expected)
})

test("GameAction.endTurn - When the player is black, it increments the turn count", () => {
  const player = "Black"
  const nextPlayer = "White"

  const game: Game.Game = gameFactory.build({
    currentPlayer: player,
    deckBlack: deckFactory.build(),
    deckWhite: deckFactory.build(),
    turnCount: 2,
  })

  const result = GameAction.endTurn(game)

  const expected: Game.Game = gameFactory.build({
    currentPlayer: nextPlayer,
    deckBlack: deckFactory.build(),
    deckWhite: deckFactory.build(),
    turnCount: 3,
  })

  expect(result).toEqual(expected)
})

// ---- Select Cell ----

test("GameAction.selectCell - when making a valid move, it plays the selected card", () => {
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
    playedCards: ["ManeuverRight"],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
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
  const result = GameAction.selectCell(pos)(game)

  const expectedBoardStr = `
-p---
-----
-----
-----
P--P-
`
  const expectedBoard = Board.parse(expectedBoardStr)
  const expectedDeckWhite: Deck.Deck = {
    playedCards: ["ManeuverRight", "DeployHoplite"],
    hand: ["ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
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
      resourcePoints: 0,
    },
    supply: Supply.initial,
    turnCount: 1,
    hegemonyWhite: 0,
    hegemonyBlack: 0,
  }

  expect(result).toEqual(expected)
})

// ---- Select Hand Card ----

test("GameAction.selectHandCard", () => {})

// ---- Select Supply Pile ----

test("GameAction.selectSupplyPile - It consumes a strategy point and adds a card to the players discard", () => {
  const player = "White"
  const deckWhite = deckFactory.build({
    playedCards: [],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: [],
  })

  const supply: Supply.Supply = [{ card: "DeployHoplite", count: 1 }]

  const game: Game.Game = gameFactory.build({
    currentPlayer: player,
    deckWhite,
    supply,
  })

  const result = GameAction.selectSupplyPile(0)(game)

  const expectedDeckWhite: Deck.Deck = {
    playedCards: [],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: ["DeployHoplite"],
  }
  const expectedSupply: Supply.Supply = [{ card: "DeployHoplite", count: 0 }]

  const expected: Game.Game = gameFactory.build({
    currentPlayer: "White",
    deckWhite: expectedDeckWhite,
    turnPoints: {
      tacticPoints: 1,
      strategyPoints: 0,
      resourcePoints: 0,
    },
    supply: expectedSupply,
  })

  expect(result).toEqual(expected)
})

test("GameAction.selectSupplyPile - If the supply count is 0, it does nothing", () => {
  const player = "White"
  const deckWhite = deckFactory.build({
    playedCards: [],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: [],
  })

  const supply: Supply.Supply = [{ card: "DeployHoplite", count: 0 }]

  const game: Game.Game = gameFactory.build({
    currentPlayer: player,
    deckWhite,
    supply,
  })

  const result = GameAction.selectSupplyPile(0)(game)

  const expectedDeckWhite: Deck.Deck = {
    playedCards: [],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: [],
  }
  const expectedSupply: Supply.Supply = [{ card: "DeployHoplite", count: 0 }]

  const expected: Game.Game = gameFactory.build({
    currentPlayer: "White",
    deckWhite: expectedDeckWhite,
    turnPoints: {
      tacticPoints: 1,
      strategyPoints: 1,
      resourcePoints: 0,
    },
    supply: expectedSupply,
  })

  expect(result).toEqual(expected)
})

test("GameAction.selectSupplyPile - If the player has no strategy points, it does nothing", () => {
  const player = "White"
  const deckWhite = deckFactory.build({
    playedCards: [],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: [],
  })

  const supply: Supply.Supply = [{ card: "DeployHoplite", count: 1 }]

  const game: Game.Game = gameFactory.build({
    currentPlayer: player,
    turnPoints: {
      tacticPoints: 1,
      strategyPoints: 0,
      resourcePoints: 0,
    },
    deckWhite,
    supply,
  })

  const result = GameAction.selectSupplyPile(0)(game)

  const expectedDeckWhite: Deck.Deck = {
    playedCards: [],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: [],
  }
  const expectedSupply: Supply.Supply = [{ card: "DeployHoplite", count: 1 }]

  const expected: Game.Game = gameFactory.build({
    currentPlayer: "White",
    deckWhite: expectedDeckWhite,
    turnPoints: {
      tacticPoints: 1,
      strategyPoints: 0,
      resourcePoints: 0,
    },
    supply: expectedSupply,
  })

  expect(result).toEqual(expected)
})
