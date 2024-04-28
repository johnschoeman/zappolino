import { expect, test } from "bun:test"
import { Option } from "effect"

import { deckFactory, gameFactory } from "../../factories"

import { Board } from "./board"
import { Card, Deck, Hand } from "./deck"
import * as Game from "./game"
import * as GameAction from "./gameAction"
import * as Player from "./player"
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
    handSize: Hand.initialHandSize,
    turnPoints: {
      hoplitePoints: 1,
      strategyPoints: 1,
      tacticPoints: 1,
      resourcePoints: 0,
      drawPoints: 0,
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

// ---- Select Cell ----

test("GameAction.selectCell - if the player has placement points and they select a valid cell, it places a piece", () => {
  const boardStr = `
-----
-p---
-----
-----
-----
-----
---P-
`
  const initialBoard = Board.parse(boardStr)
  const player = "White"

  const game1: Game.Game = gameFactory.build({
    board: initialBoard,
    currentPlayer: player,
    turnPoints: {
      hoplitePoints: 1,
    },
  })
  const game2: Game.Game = gameFactory.build({
    board: initialBoard,
    currentPlayer: player,
    turnPoints: {
      hoplitePoints: 0,
    },
  })

  const pos = { rowIdx: Player.homeRowIdx("White"), colIdx: 0 }

  const result1 = GameAction.selectCell(pos)(game1)
  const result2 = GameAction.selectCell(pos)(game2)

  const expectedBoardStr = `
-----
-p---
-----
-----
-----
-----
P--P-
`
  const expectedBoard = Board.parse(expectedBoardStr)

  const expected1: Game.Game = gameFactory.build({
    currentPlayer: "White",
    board: expectedBoard,
    turnPoints: {
      hoplitePoints: 0,
    },
  })
  const expected2: Game.Game = gameFactory.build({
    currentPlayer: "White",
    board: initialBoard,
    turnPoints: {
      hoplitePoints: 0,
    },
  })

  expect(result1).toEqual(expected1)
  expect(result2).toEqual(expected2)
})

test("GameAction.selectCell - if a player has a tactic card selected, it plays the tactic card", () => {
  const boardStr = `
-----
-p---
-----
-----
-----
-----
---P-
`
  const initialBoard = Board.parse(boardStr)
  const player = "White"

  const deckWhite1 = deckFactory.build({
    hand: ["ManeuverForward"],
    disc: [],
  })

  const game1: Game.Game = gameFactory.build({
    board: initialBoard,
    currentPlayer: player,
    selectedCardIdx: Option.some(0),
    deckWhite: deckWhite1,
    turnPoints: {
      hoplitePoints: 1,
      tacticPoints: 1,
      strategyPoints: 1,
      resourcePoints: 1,
    },
  })

  const pos = { rowIdx: Player.homeRowIdx("White"), colIdx: 3 }

  const result1 = GameAction.selectCell(pos)(game1)

  const expectedBoardStr = `
-----
-p---
-----
-----
-----
---P-
-----
`
  const expectedBoard = Board.parse(expectedBoardStr)
  const expectedDeckWhite1 = deckFactory.build({
    hand: [],
    playedCards: ["ManeuverForward"],
  })
  const expectedSelectedCardIdx = Option.none()
  const expectedTurnPoints = {
    hoplitePoints: 1,
    tacticPoints: 0,
    strategyPoints: 1,
    resourcePoints: 1,
    drawPoints: 0,
  }

  expect(result1.board).toEqual(expectedBoard)
  expect(result1.selectedCardIdx).toEqual(expectedSelectedCardIdx)
  expect(result1.deckWhite).toEqual(expectedDeckWhite1)
  expect(result1.turnPoints).toEqual(expectedTurnPoints)
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
