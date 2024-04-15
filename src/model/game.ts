import { Option, pipe, ReadonlyArray } from "effect"

import { Board, Cell } from "./board"
import { Card, Deck } from "./deck"
import * as Player from "./player"
import * as Position from "./position"
import * as Supply from "./supply"

export type Game = {
  board: Board.Board<Cell.Cell>
  currentPlayer: Player.Player
  selectedCardIdx: Option.Option<number>
  turnPoints: TurnPoints
  deckWhite: Deck.Deck
  deckBlack: Deck.Deck
  supply: Supply.Supply
  turnCount: number
  hegemonyWhite: number
  hegemonyBlack: number
}

type TurnPoints = {
  strategyPoints: number
  tacticPoints: number
  resourcePoints: number
}

export const initialTurnPoints: TurnPoints = {
  strategyPoints: 1,
  tacticPoints: 1,
  resourcePoints: 0,
}

export const initial: Game = {
  board: Board.empty,
  currentPlayer: "White",
  selectedCardIdx: Option.none(),
  turnPoints: initialTurnPoints,
  deckWhite: Deck.initial,
  deckBlack: Deck.initial,
  supply: Supply.initial,
  turnCount: 1,
  hegemonyBlack: 0,
  hegemonyWhite: 0,
}

export const show = (game: Game): string => {
  const { board, currentPlayer } = game
  return `${Board.show(Cell.show)(board)} | player: ${currentPlayer}`
}

// Select -> User clicks a selectable game component
// Consume -> User uses up a consumable game component, such as a card or point
// Play -> Peforming the action that a card allows

// ---- Getters ----

export const currentPlayerDeck = (game: Game): Deck.Deck => {
  return deckFor(game.currentPlayer)(game)
}

export const deckFor =
  (player: Player.Player) =>
  (game: Game): Deck.Deck => {
    switch (player) {
      case "White":
        return game.deckWhite
      case "Black":
        return game.deckBlack
    }
  }

// ---- Update Game State

export const incrementTurnCount = (game: Game): Game => {
  const currentPlayer = game.currentPlayer

  if (currentPlayer === "Black") {
    return { ...game, turnCount: game.turnCount + 1 }
  } else {
    return game
  }
}

export const unselectHandCard = (game: Game): Game => {
  return {
    ...game,
    selectedCardIdx: Option.none(),
  }
}

export const updateSupply =
  (supply: Supply.Supply) =>
  (game: Game): Game => {
    return {
      ...game,
      supply,
    }
  }

export const consumeStrategyPoint = (game: Game): Game => {
  const turnPoints = game.turnPoints
  const nextTurnPoints = {
    ...turnPoints,
    strategyPoints: turnPoints.strategyPoints - 1,
  }
  return {
    ...game,
    turnPoints: nextTurnPoints,
  }
}

export const increaseTurnPoints =
  ([strategyPoints, tacticPoints, resourcePoints]: Card.PlayValue) =>
  (game: Game): Game => {
    const turnPoints = game.turnPoints
    const nextTurnPoints = {
      strategyPoints: turnPoints.strategyPoints + strategyPoints,
      tacticPoints: turnPoints.tacticPoints + tacticPoints,
      resourcePoints: turnPoints.resourcePoints + resourcePoints,
    }
    return {
      ...game,
      turnPoints: nextTurnPoints,
    }
  }

export const consumeTacticPoint = (game: Game): Game => {
  const turnPoints = game.turnPoints
  const nextTurnPoints = {
    ...turnPoints,
    tacticPoints: turnPoints.tacticPoints - 1,
  }
  return {
    ...game,
    turnPoints: nextTurnPoints,
  }
}

export const consumeSelectedCard = (game: Game): Game => {
  const player = game.currentPlayer
  const deck = currentPlayerDeck(game)
  const nextDeck = pipe(
    game.selectedCardIdx,
    Option.map(cardIdx => Deck.consumeCard(cardIdx)(deck)),
    Option.getOrElse(() => deck),
  )
  const nextGame = pipe(game, updateDeckFor(player)(nextDeck), unselectHandCard)
  return nextGame
}

export const updateDeckFor =
  (player: Player.Player) =>
  (deck: Deck.Deck) =>
  (game: Game): Game => {
    switch (player) {
      case "White": {
        const next = { ...game }
        next.deckWhite = deck
        return next
      }
      case "Black": {
        const next = { ...game }
        next.deckBlack = deck
        return next
      }
    }
  }

export const resetTurnPoints = (game: Game): Game => {
  return {
    ...game,
    turnPoints: initialTurnPoints,
  }
}

// ---- Updating Board ----

export const movePiece =
  (from: Position.Position) =>
  (to: Position.Position) =>
  (game: Game): Game => {
    const board = game.board

    const piece = pipe(
      board,
      Board.lookup(from.rowIdx)(from.colIdx),
      Option.getOrElse(() => Cell.empty),
    )

    const nextBoard = pipe(
      board,
      Board.modifyAt(from.rowIdx)(from.colIdx)(Cell.empty),
      Board.modifyAt(to.rowIdx)(to.colIdx)(piece),
    )

    return {
      ...game,
      board: nextBoard,
    }
  }

export const addPiece =
  (rowIdx: number) =>
  (colIdx: number) =>
  (game: Game): Game => {
    const board = game.board
    const currentPlayer = game.currentPlayer
    const piece: Cell.Cell = {
      _tag: "Piece",
      player: currentPlayer,
    }

    const nextBoard = Board.modifyAt(rowIdx)(colIdx)(piece)(board)

    return {
      ...game,
      board: nextBoard,
    }
  }

type GameAndPositions = [Game, Position.Position[]]

export const progressBoard = (game: Game): Game => {
  const nextGame = pipe(
    [game, []],
    getPiecePositionsFor,
    incrementPositionFor,
    removePiecesFor,
    addPiecesFor,
    ([game_, _]) => game_,
  )

  return nextGame
}

const getPiecePositionsFor = ([
  game,
  _positions,
]: GameAndPositions): GameAndPositions => {
  const { board, currentPlayer } = game
  const nextPositions = Board.reduceWithIndex<Cell.Cell, Position.Position[]>(
    [],
    (rowIdx, colIdx, acc, cell) => {
      if (Cell.belongsTo(currentPlayer)(cell)) {
        return [...acc, { rowIdx, colIdx }]
      } else {
        return acc
      }
    },
  )(board)

  return [game, nextPositions]
}

const incrementPositionFor = ([
  game,
  positions,
]: GameAndPositions): GameAndPositions => {
  const { currentPlayer } = game
  const nextPositions = ReadonlyArray.map(
    (position: Position.Position): Position.Position => {
      const { rowIdx, colIdx } = position
      switch (currentPlayer) {
        case "Black":
          return Position.build(rowIdx + 1, colIdx)
        case "White":
          return Position.build(rowIdx - 1, colIdx)
        default:
          return Position.build(rowIdx, colIdx)
      }
    },
  )(positions)

  return [game, nextPositions]
}

const removePiecesFor = ([
  game,
  positions,
]: GameAndPositions): GameAndPositions => {
  const { board, currentPlayer } = game
  const nextBoard = pipe(
    board,
    Board.map<Cell.Cell, Cell.Cell>(cell => {
      return pipe(
        cell,
        Cell.belongsTo(currentPlayer),
        belongsToCurrentPlayer => {
          return belongsToCurrentPlayer ? Cell.empty : cell
        },
      )
    }),
  )

  return [{ ...game, board: nextBoard }, positions]
}

const addPiecesFor = ([
  game,
  positions,
]: GameAndPositions): GameAndPositions => {
  const { board, currentPlayer } = game
  const nextBoard: Board.Board<Cell.Cell> = pipe(
    positions,
    ReadonlyArray.reduce(board, (acc, position) => {
      const { rowIdx, colIdx } = position
      const piece: Cell.Cell = {
        _tag: "Piece",
        player: currentPlayer,
      }
      return Board.modifyAt(rowIdx)(colIdx)(piece)(acc)
    }),
  )

  let countHegemonyWhite = 0
  if (currentPlayer === "White") {
    countHegemonyWhite = pipe(
      positions,
      ReadonlyArray.reduce(0, (acc: number, pos: Position.Position) => {
        if (pos.rowIdx < 0) {
          return acc + 1
        } else {
          return acc
        }
      }),
    )
  }

  let countHegemonyBlack = 0
  if (currentPlayer === "Black") {
    countHegemonyBlack = pipe(
      positions,
      ReadonlyArray.reduce(0, (acc: number, pos: Position.Position) => {
        if (pos.rowIdx > 4) {
          return acc + 1
        } else {
          return acc
        }
      }),
    )
  }

  const nextGame = {
    ...game,
    board: nextBoard,
    hegemonyWhite: game.hegemonyWhite + countHegemonyWhite,
    hegemonyBlack: game.hegemonyBlack + countHegemonyBlack,
  }
  return [nextGame, []]
}

export const togglePlayer = (game: Game): Game => {
  const { currentPlayer } = game
  return {
    ...game,
    currentPlayer: Player.toggle(currentPlayer),
  }
}
