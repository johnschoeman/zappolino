import { expect, test } from "bun:test"

import { Either } from "effect"

import { Card } from "./deck"
import { gameFactory } from "../../factories"
import * as Game from "./game"
import * as GamePlayCard from "./gamePlayCard"
import { Board } from "./board"

test("GamePlayCard.validateHasCardCost - if the player has the points, it returns the game, and error if not", () => {
  const strategyCard: Card.Card = "DeployHoplite"
  const tacticCard: Card.Card = "ManeuverLeft"

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

  const result1 = GamePlayCard.validateHasCardCost(strategyCard)(game1)
  const result2 = GamePlayCard.validateHasCardCost(tacticCard)(game1)
  const result3 = GamePlayCard.validateHasCardCost(strategyCard)(game2)
  const result4 = GamePlayCard.validateHasCardCost(tacticCard)(game2)

  expect(result1).toEqual(Either.right(game1))
  expect(result2).toEqual(Either.right(game1))
  expect(result3).toEqual(Either.left("NotEnoughStrategyPoints"))
  expect(result4).toEqual(Either.left("NotEnoughTacticPoints"))
})

test("GamePlayCard.playDeployHoplitePieceCard - it only allows valid placement", () => {
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

  const result1 = GamePlayCard.playDeployHoplitePieceCard(posValid)(game)
  const result2 = GamePlayCard.playDeployHoplitePieceCard(posNotOnHomeRow)(game)
  const result3 =
    GamePlayCard.playDeployHoplitePieceCard(posOnExistingPiece)(game)

  expect(result1).toEqual(Either.right(expected1))
  expect(result2).toEqual(Either.left("InvalidPlacement"))
  expect(result3).toEqual(Either.left("InvalidPlacement"))
})

test("GamePlayCard.playManeuverForwardCard - it moves the select piece forward", () => {
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
  const posManeuverOffBoard = { rowIdx: 0, colIdx: 4 }

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

  const result1 = GamePlayCard.playManeuverForwardCard(posValid)(game)
  const result2 = GamePlayCard.playManeuverForwardCard(posNoPiece)(game)
  const result3 =
    GamePlayCard.playManeuverForwardCard(posOtherPlayerPiece)(game)
  const result4 = GamePlayCard.playManeuverForwardCard(posOnToOwnPiece)(game)
  const result5 =
    GamePlayCard.playManeuverForwardCard(posManeuverOffBoard)(game)

  expect(result1).toEqual(Either.right(expected1))
  expect(result2).toEqual(Either.left("InvalidPieceSelection"))
  expect(result3).toEqual(Either.left("InvalidPieceSelection"))
  expect(result4).toEqual(Either.left("InvalidManeuverDestination"))
  expect(result5).toEqual(Either.left("InvalidManeuverDestination"))
})
