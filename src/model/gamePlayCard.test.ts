import { expect, test } from "bun:test"
import { Either } from "effect"

import { gameFactory } from "../../factories"

import { Board } from "./board"
import { Card } from "./deck"
import * as Game from "./game"
import * as GamePlayCard from "./gamePlayCard"

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

test("GamePlayCard.playDeployHopliteCard - it only allows valid placement", () => {
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

  const result1 = GamePlayCard.playDeployHoplitePiece(posValid)(game)
  const result2 = GamePlayCard.playDeployHoplitePiece(posNotOnHomeRow)(game)
  const result3 = GamePlayCard.playDeployHoplitePiece(posOnExistingPiece)(game)

  expect(result1).toEqual(Either.right(expected1))
  expect(result2).toEqual(Either.left("InvalidPlacement"))
  expect(result3).toEqual(Either.left("InvalidPlacement"))
})

test("GamePlayCard.playManeuverForwardCard - it moves the select piece forward", () => {
  const player = "White"
  const board = Board.parse(
    `
---P-
-----
-----
-Pp--
PPP--
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
  const posOntoOwnPiece = { rowIdx: 4, colIdx: 1 }
  const posOntoOtherPiece = { rowIdx: 4, colIdx: 2 }
  const posNoPiece = { rowIdx: 4, colIdx: 3 }
  const posOtherPlayerPiece = { rowIdx: 3, colIdx: 2 }
  const posEdgeOfBoard = { rowIdx: 0, colIdx: 3 }

  const expectedBoard = Board.parse(
    `
---P-
-----
-----
PPp--
-PP--
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

  const resultValid = GamePlayCard.playManeuverForward(posValid)(game)
  const resultNoPiece = GamePlayCard.playManeuverForward(posNoPiece)(game)
  const resulOtherPlayerPiece =
    GamePlayCard.playManeuverForward(posOtherPlayerPiece)(game)
  const resultOntoOwnPiece =
    GamePlayCard.playManeuverForward(posOntoOwnPiece)(game)
  const resultOffOfBoard =
    GamePlayCard.playManeuverForward(posEdgeOfBoard)(game)
  const resultOntoOtherPiece =
    GamePlayCard.playManeuverForward(posOntoOtherPiece)(game)

  expect(resultValid).toEqual(Either.right(expected1))
  expect(resultNoPiece).toEqual(Either.left("InvalidPieceSelection"))
  expect(resulOtherPlayerPiece).toEqual(Either.left("InvalidPieceSelection"))
  expect(resultOntoOwnPiece).toEqual(Either.left("InvalidManeuverOntoOwnPiece"))
  expect(resultOffOfBoard).toEqual(Either.left("InvalidManeuverOffBoard"))
  expect(resultOntoOtherPiece).toEqual(
    Either.left("InvalidManeuverOntoOtherPiece"),
  )
})

test("GamePlayCard.playAssaultForward - it assaults the select piece forward", () => {
  const player = "White"
  const board = Board.parse(
    `
---P-
-----
-----
-Pp--
PPP--
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

  const posValid = { rowIdx: 4, colIdx: 2 }
  const posOntoOwnPiece = { rowIdx: 4, colIdx: 1 }
  const posOntoNoPiece = { rowIdx: 4, colIdx: 0 }
  const posNoPiece = { rowIdx: 4, colIdx: 3 }
  const posOtherPlayerPiece = { rowIdx: 3, colIdx: 2 }
  const posEdgeOfBoard = { rowIdx: 0, colIdx: 3 }

  const expectedBoard = Board.parse(
    `
---P-
-----
-----
-PP--
PP---
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

  const resultValid = GamePlayCard.playAssaultForward(posValid)(game)
  const resultNoPiece = GamePlayCard.playAssaultForward(posNoPiece)(game)
  const resulOtherPlayerPiece =
    GamePlayCard.playAssaultForward(posOtherPlayerPiece)(game)
  const resultOntoNoPiece =
    GamePlayCard.playAssaultForward(posOntoNoPiece)(game)
  const resultOntoOwnPiece =
    GamePlayCard.playAssaultForward(posOntoOwnPiece)(game)
  const resultOffOfBoard = GamePlayCard.playAssaultForward(posEdgeOfBoard)(game)

  expect(resultValid).toEqual(Either.right(expected1))
  expect(resultNoPiece).toEqual(Either.left("InvalidPieceSelection"))
  expect(resulOtherPlayerPiece).toEqual(Either.left("InvalidPieceSelection"))
  expect(resultOntoOwnPiece).toEqual(
    Either.left("InvalidAssaultNotOntoOtherPiece"),
  )
  expect(resultOntoNoPiece).toEqual(
    Either.left("InvalidAssaultNotOntoOtherPiece"),
  )
  expect(resultOffOfBoard).toEqual(
    Either.left("InvalidAssaultNotOntoOtherPiece"),
  )
})

test("GamePlayCard.playCharge - it charges the selected piece forward", () => {
  const player = "White"
  const board = Board.parse(
    `
---P-
-----
-----
-Pp--
PPP--
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

  const posOntoNoPiece = { rowIdx: 4, colIdx: 0 }
  const posOntoOwnPiece = { rowIdx: 4, colIdx: 1 }
  const posOntoOtherPiece = { rowIdx: 4, colIdx: 2 }
  const posNoPiece = { rowIdx: 4, colIdx: 3 }
  const posOtherPlayerPiece = { rowIdx: 3, colIdx: 2 }
  const posEdgeOfBoard = { rowIdx: 0, colIdx: 3 }

  const expectedOntoNoPieceBoard = Board.parse(
    `
---P-
-----
-----
PPp--
-PP--
`,
  )
  const expectedOntoNoPiece: Game.Game = gameFactory.build({
    board: expectedOntoNoPieceBoard,
    currentPlayer: "White",
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 0,
    },
  })

  const expectedOntoOtherPieceBoard = Board.parse(
    `
---P-
-----
-----
-PP--
PP---
`,
  )
  const expectedOntoOtherPiece: Game.Game = gameFactory.build({
    board: expectedOntoOtherPieceBoard,
    currentPlayer: "White",
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 0,
    },
  })

  const expectedOffBoardBoard = Board.parse(
    `
-----
-----
-----
-Pp--
PPP--
`,
  )
  const expectedOffBoard: Game.Game = gameFactory.build({
    board: expectedOffBoardBoard,
    currentPlayer: "White",
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 0,
    },
  })

  const resultOntoNoPiece = GamePlayCard.playCharge(posOntoNoPiece)(game)
  const resultOntoOtherPiece = GamePlayCard.playCharge(posOntoOtherPiece)(game)
  const resultOntoOwnPiece = GamePlayCard.playCharge(posOntoOwnPiece)(game)
  const resultNoPiece = GamePlayCard.playCharge(posNoPiece)(game)
  const resulOtherPlayerPiece =
    GamePlayCard.playCharge(posOtherPlayerPiece)(game)
  const resultOffOfBoard = GamePlayCard.playCharge(posEdgeOfBoard)(game)

  expect(resultOntoNoPiece).toEqual(Either.right(expectedOntoNoPiece))
  expect(resultOntoOtherPiece).toEqual(Either.right(expectedOntoOtherPiece))
  expect(resultOffOfBoard).toEqual(Either.right(expectedOffBoard))
  expect(resultNoPiece).toEqual(Either.left("InvalidPieceSelection"))
  expect(resulOtherPlayerPiece).toEqual(Either.left("InvalidPieceSelection"))
  expect(resultOntoOwnPiece).toEqual(Either.left("InvalidChargeOntoOwnPiece"))
})

test("GamePlayCard.flankLeft - it flanks the selected piece to the left", () => {
  const player = "White"
  const board = Board.parse(
    `
---P-
-----
-----
-PpP-
PPP--
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

  const posOntoNoPiece = { rowIdx: 3, colIdx: 1 }
  const posOntoOwnPiece = { rowIdx: 4, colIdx: 1 }
  const posOntoOtherPiece = { rowIdx: 3, colIdx: 3 }
  const posNoPiece = { rowIdx: 4, colIdx: 3 }
  const posOtherPlayerPiece = { rowIdx: 3, colIdx: 2 }
  const posEdgeOfBoard = { rowIdx: 4, colIdx: 0 }

  const expectedOntoNoPieceBoard = Board.parse(
    `
---P-
-----
-----
P-pP-
PPP--
`,
  )
  const expectedOntoNoPiece: Game.Game = gameFactory.build({
    board: expectedOntoNoPieceBoard,
    currentPlayer: "White",
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 0,
    },
  })

  const expectedOntoOtherPieceBoard = Board.parse(
    `
---P-
-----
-----
-PP--
PPP--
`,
  )
  const expectedOntoOtherPiece: Game.Game = gameFactory.build({
    board: expectedOntoOtherPieceBoard,
    currentPlayer: "White",
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 0,
    },
  })

  const resultOntoNoPiece = GamePlayCard.playFlankLeft(posOntoNoPiece)(game)
  const resultOntoOtherPiece =
    GamePlayCard.playFlankLeft(posOntoOtherPiece)(game)
  const resultOntoOwnPiece = GamePlayCard.playFlankLeft(posOntoOwnPiece)(game)
  const resultNoPiece = GamePlayCard.playFlankLeft(posNoPiece)(game)
  const resulOtherPlayerPiece =
    GamePlayCard.playFlankLeft(posOtherPlayerPiece)(game)
  const resultOffOfBoard = GamePlayCard.playFlankLeft(posEdgeOfBoard)(game)

  expect(resultOntoNoPiece).toEqual(Either.right(expectedOntoNoPiece))
  expect(resultOntoOtherPiece).toEqual(Either.right(expectedOntoOtherPiece))
  expect(resultOffOfBoard).toEqual(Either.left("InvalidFlankLeftOffBoard"))
  expect(resultNoPiece).toEqual(Either.left("InvalidPieceSelection"))
  expect(resulOtherPlayerPiece).toEqual(Either.left("InvalidPieceSelection"))
  expect(resultOntoOwnPiece).toEqual(
    Either.left("InvalidFlankLeftOntoOwnPiece"),
  )
})
