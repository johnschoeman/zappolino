import { pipe, ReadonlyArray } from "effect"

import * as Board from "./board"
import { Deck } from "./deck"
import * as Player from "./player"
import * as Position from "./position"

export type Game = {
  board: Board.Board<Board.Cell>
  currentPlayer: Player.Player
  deckWhite: Deck.Deck
  deckBlack: Deck.Deck
}

export const initial: Game = {
  board: Board.empty,
  currentPlayer: "White",
  deckWhite: Deck.initial,
  deckBlack: Deck.initial,
}

export const addPiece =
  (rowIdx: number) =>
  (colIdx: number) =>
  (game: Game): Game => {
    const { board, currentPlayer, deckWhite, deckBlack } = game
    const piece: Board.Cell = {
      kind: "Piece",
      player: currentPlayer,
    }

    if (!isValidPlacement(currentPlayer)(rowIdx)) {
      return { board, currentPlayer, deckWhite, deckBlack }
    }

    const nextBoard = Board.modifyAt(rowIdx)(colIdx)(piece)(board)

    return {
      board: nextBoard,
      currentPlayer,
      deckWhite,
      deckBlack,
    }
  }

const isValidPlacement =
  (player: Player.Player) =>
  (rowIdx: number): boolean => {
    switch (player) {
      case "Black":
        return rowIdx === 0
      case "White":
        return rowIdx === 4
    }
  }

type GameAndPositions = [Game, Position.Position[]]

export const progress = (game: Game): Game => {
  const nextGame = pipe(
    [game, []],
    getPiecePositionsFor,
    incrementPositionFor,
    removePiecesFor,
    addPiecesFor,
    togglePlayer,
    ([game_]) => game_,
  )

  return nextGame
}

const getPiecePositionsFor = ([
  game,
  _positions,
]: GameAndPositions): GameAndPositions => {
  const { board, currentPlayer } = game
  const nextPositions = Board.reduceWithIndex<Board.Cell, Position.Position[]>(
    [],
    (rowIdx, colIdx, acc, cell) => {
      if (Board.cellBelongsTo(currentPlayer)(cell)) {
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
    Board.map<Board.Cell, Board.Cell>(cell => {
      return pipe(
        cell,
        Board.cellBelongsTo(currentPlayer),
        belongsToCurrentPlayer => {
          return belongsToCurrentPlayer ? Board.emptyCell : cell
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
  const { board, currentPlayer, deckWhite, deckBlack } = game
  const nextBoard: Board.Board<Board.Cell> = pipe(
    positions,
    ReadonlyArray.reduce(board, (acc, position) => {
      const { rowIdx, colIdx } = position
      const piece: Board.Cell = {
        kind: "Piece",
        player: currentPlayer,
      }
      return Board.modifyAt(rowIdx)(colIdx)(piece)(acc)
    }),
  )

  return [{ board: nextBoard, currentPlayer, deckWhite, deckBlack }, []]
}

const togglePlayer = ([
  game,
  positions,
]: GameAndPositions): GameAndPositions => {
  const { currentPlayer } = game
  return [
    {
      ...game,
      currentPlayer: Player.toggle(currentPlayer),
    },
    positions,
  ]
}

export const show = (game: Game): string => {
  const { board, currentPlayer } = game
  return `${Board.show(Board.showCell)(board)} | player: ${currentPlayer}`
}
