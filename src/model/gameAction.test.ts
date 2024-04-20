import { expect, test } from "bun:test"
import { Option } from "effect"

import { deckFactory, gameFactory } from "../../factories"

import { Board } from "./board"
import { Card, Deck } from "./deck"
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
    commitedCards: ["ManeuverLeft"],
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
      "ManeuverLeft",
      "ManeuverRight",
    ],
    playedCards: [],
    commitedCards: [],
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
    hegemony: {
      hegemonyBlack: 0,
      hegemonyWhite: 0,
    },
  }

  expect(result).toEqual(expected)
})

test("GameAction.endTurn - When the player is black, it increments the turn count", () => {
  const player = "Black"

  const game: Game.Game = gameFactory.build({
    currentPlayer: player,
    turnCount: 2,
  })

  const result = GameAction.endTurn(game)

  const expectedTurnCount = 3

  expect(result.turnCount).toEqual(expectedTurnCount)
})

test("GameAction.endTurn - When a piece makes it off the board it adds a hegemony point", () => {
  const boardStr = `
-P---
-----
-----
-----
---p-
`
  const board = Board.parse(boardStr)
  const player = "White"

  const game: Game.Game = gameFactory.build({
    board,
    currentPlayer: player,
    hegemony: {
      hegemonyBlack: 0,
      hegemonyWhite: 0,
    },
  })

  const result = GameAction.endTurn(game)

  const expectedBoardStr = `
-----
-----
-----
-----
---p-
`
  const expectedBoard = Board.parse(expectedBoardStr)

  const expectedHegemony: Game.Hegemony = {
    hegemonyBlack: 0,
    hegemonyWhite: 1,
  }

  expect(result.hegemony).toEqual(expectedHegemony)
  expect(result.board).toEqual(expectedBoard)
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
    playedCards: ["DeployHoplite", "ManeuverRight"],
    hand: ["ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: [],
    commitedCards: [],
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
    hegemony: {
      hegemonyWhite: 0,
      hegemonyBlack: 0,
    },
  }

  expect(result).toEqual(expected)
})

// ---- Select Hand Card ----

test("GameAction.selectHandCard", () => {})

// ---- Select Supply Pile ----

test("GameAction.selectSupplyPile - It consumes the resource points and adds a card to the players discard", () => {
  const player = "White"
  const deckWhite = deckFactory.build({
    playedCards: [],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: [],
  })

  const supplyCard: Card.Card = "PoliticalReforms"
  const supply: Supply.Supply = [{ card: supplyCard, count: 1 }]
  const resourcePoints = Card.toResourceCost(supplyCard) + 1

  const game: Game.Game = gameFactory.build({
    currentPlayer: player,
    deckWhite,
    supply,
    turnPoints: { strategyPoints: 1, tacticPoints: 0, resourcePoints },
  })

  const result = GameAction.selectSupplyPile(0)(game)

  const expectedDeckWhite: Deck.Deck = {
    playedCards: [],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: [supplyCard],
    commitedCards: [],
  }
  const expectedSupply: Supply.Supply = [{ card: supplyCard, count: 0 }]

  const expected: Game.Game = gameFactory.build({
    currentPlayer: "White",
    deckWhite: expectedDeckWhite,
    turnPoints: { tacticPoints: 0, strategyPoints: 1, resourcePoints: 1 },
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
    commitedCards: [],
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
    commitedCards: [],
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

test("GameAction.selectSupplyPile - If the player has doesnt have enough resource points, it does nothing", () => {
  const player = "White"
  const deckWhite = deckFactory.build({
    playedCards: [],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: [],
    commitedCards: [],
  })

  const supplyCard: Card.Card = "PoliticalReforms"
  const supply: Supply.Supply = [{ card: supplyCard, count: 1 }]

  const game: Game.Game = gameFactory.build({
    currentPlayer: player,
    turnPoints: { tacticPoints: 1, strategyPoints: 1, resourcePoints: 3 },
    deckWhite,
    supply,
  })

  const result = GameAction.selectSupplyPile(0)(game)

  const expectedDeckWhite: Deck.Deck = {
    playedCards: [],
    hand: ["DeployHoplite", "ManeuverLeft"],
    draw: ["DeployHoplite", "ManeuverForward"],
    disc: [],
    commitedCards: [],
  }
  const expectedSupply: Supply.Supply = [{ card: supplyCard, count: 1 }]

  const expected: Game.Game = gameFactory.build({
    currentPlayer: "White",
    deckWhite: expectedDeckWhite,
    turnPoints: { tacticPoints: 1, strategyPoints: 1, resourcePoints: 3 },
    supply: expectedSupply,
  })

  expect(result).toEqual(expected)
})
