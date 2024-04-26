import { Array, Option, pipe } from "effect"

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
  hegemony: Hegemony
}

export type Hegemony = {
  hegemonyBlack: number
  hegemonyWhite: number
}

export type TurnPoints = {
  placementPoints: number
  strategyPoints: number
  tacticPoints: number
  resourcePoints: number
}

export const initialTurnPoints: TurnPoints = {
  placementPoints: 1,
  strategyPoints: 1,
  tacticPoints: 1,
  resourcePoints: 0,
}

export const initialHegemony: Hegemony = {
  hegemonyWhite: 0,
  hegemonyBlack: 0,
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
  hegemony: initialHegemony,
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

export const decreaseTurnPoints =
  ([
    placementPointsDiff,
    strategyPointsDiff,
    tacticPointsDiff,
    resourcePointsDiff,
  ]: Card.PlayValue) =>
  (game: Game): Game => {
    const { placementPoints, strategyPoints, tacticPoints, resourcePoints } =
      game.turnPoints
    const nextTurnPoints = {
      placementPoints: placementPoints - placementPointsDiff,
      strategyPoints: strategyPoints - strategyPointsDiff,
      tacticPoints: tacticPoints - tacticPointsDiff,
      resourcePoints: resourcePoints - resourcePointsDiff,
    }
    return {
      ...game,
      turnPoints: nextTurnPoints,
    }
  }

export const increaseTurnPoints =
  ([
    placementPointsDiff,
    strategyPointsDiff,
    tacticPointsDiff,
    resourcePointsDiff,
  ]: Card.PlayValue) =>
  (game: Game): Game => {
    const { placementPoints, strategyPoints, tacticPoints, resourcePoints } =
      game.turnPoints
    const nextTurnPoints = {
      placementPoints: placementPoints + placementPointsDiff,
      strategyPoints: strategyPoints + strategyPointsDiff,
      tacticPoints: tacticPoints + tacticPointsDiff,
      resourcePoints: resourcePoints + resourcePointsDiff,
    }
    return {
      ...game,
      turnPoints: nextTurnPoints,
    }
  }

export const consumePlacementPoint = (game: Game): Game => {
  const turnPoints = game.turnPoints
  const nextTurnPoints = {
    ...turnPoints,
    placementPoints: turnPoints.placementPoints - 1,
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

export const commitSelectedCard = (game: Game): Game => {
  const player = game.currentPlayer
  const deck = currentPlayerDeck(game)
  const card = pipe(
    game.selectedCardIdx,
    Option.andThen(cardIdx => {
      return Deck.getCardAt(cardIdx)(deck)
    }),
  )
  if (Option.isNone(card)) {
    return game
  }

  const resourceValue = Card.toResourceValue(card.value)

  const nextDeck = pipe(
    game.selectedCardIdx,
    Option.map(cardIdx => Deck.commitCard(cardIdx)(deck)),
    Option.getOrElse(() => deck),
  )
  const nextGame = pipe(
    game,
    increaseTurnPoints([0, 0, 0, resourceValue]),
    updateDeckFor(player)(nextDeck),
    unselectHandCard,
  )
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

export const togglePlayer = (game: Game): Game => {
  const { currentPlayer } = game
  return {
    ...game,
    currentPlayer: Player.toggle(currentPlayer),
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

type BoardProgression = [Game, Position.Position[]]

export const progressBoard = (game: Game): Game => {
  const nextGame = pipe(
    [game, []],
    // getPiecePositionsFor,
    // incrementPositionFor,
    // removePiecesFor,
    // addPiecesFor,
    progressEachColumn,
    addHegemonyPoints,
    removePiecesInHomeRow,
    ([game_, _positions]) => game_,
  )

  return nextGame
}

const progressEachColumn = ([
  game,
  _positions,
]: BoardProgression): BoardProgression => {
  const { board } = game
  const nextBoard = pipe(
    board,
    Board.transpose,
    Array.map(progressColumn(game.currentPlayer)),
    Board.transpose,
  )
  return [{ ...game, board: nextBoard }, []]
}

// traverse the array from opponent side to player side
// check if the cell belongs to the player
// if no
//   continue
// if yes
//   check if piece is opponents piece
//   if no
//     continue
//   if yes
//     check count of consecutive opponent pieces towards the opponent side and
//     consecutive player pieces towards player side.
//     if player pieces > opponent pieces
//       move the player piece forward
//     else
//       continue

export const progressColumn =
  (player: Player.Player) =>
  (column: Board.Column<Cell.Cell>): Board.Column<Cell.Cell> => {
    return pipe(
      column,
      c => {
        if (player === "Black") {
          return Array.reverse(c)
        } else {
          return c
        }
      },
      col =>
        Array.reduce<Board.Column<Cell.Cell>, Cell.Cell>(
          col,
          (acc, cell, idx) => {
            if (!Cell.isPlayers(player)(cell)) {
              return acc
            }

            const cellTowardsOpponent = pipe(acc, Array.get(idx - 1))

            const isCellTowardsOppoentBelongToPlayer = pipe(
              cellTowardsOpponent,
              Option.map(Cell.isPlayers(player)),
              Option.getOrElse(() => false),
            )

            const isCellTowardsOpponentEmpty = pipe(
              cellTowardsOpponent,
              Option.map(Cell.isEmpty),
              Option.getOrElse(() => false),
            )

            if (isCellTowardsOppoentBelongToPlayer) {
              return acc
            }

            if (isCellTowardsOpponentEmpty) {
              return pipe(
                acc,
                Array.modify(idx - 1, () => Cell.buildPiece(player)),
                Array.modify(idx, () => Cell.empty),
              )
            }

            const [leftDepth, rightDepth] = pipe(
              acc,
              Array.splitAt(idx),
              ([left, right]) => {
                const _leftDepth = pipe(
                  left,
                  Array.reverse,
                  Array.takeWhile((_cell, _idx) =>
                    Cell.isOpponents(player)(_cell),
                  ),
                  Array.length,
                )
                const _rightDepth = pipe(
                  right,
                  Array.takeWhile((_cell, _idx) =>
                    Cell.isPlayers(player)(_cell),
                  ),
                  Array.length,
                )

                return [_leftDepth, _rightDepth]
              },
            )

            const isDepthGreater = rightDepth > leftDepth

            if (isDepthGreater) {
              return pipe(
                acc,
                Array.modify(idx - 1, () => Cell.buildPiece(player)),
                Array.modify(idx, () => Cell.empty),
              )
            }
            return acc
          },
        )(col),
      c => {
        if (player === "Black") {
          return Array.reverse(c)
        } else {
          return c
        }
      },
    )
  }

const addHegemonyPoints = ([
  game,
  _positions,
]: BoardProgression): BoardProgression => {
  const { board } = game

  const currentHegemony = game.hegemony

  const nextHegemonyWhite = pipe(
    board,
    Array.get(Player.homeRowIdx("Black")),
    Option.map(Array.filter(Cell.isPlayers("White"))),
    Option.map(Array.length),
    Option.getOrElse(() => 0),
  )

  const nextHegemonyBlack = pipe(
    board,
    Array.get(Player.homeRowIdx("White")),
    Option.map(Array.filter(Cell.isPlayers("Black"))),
    Option.map(Array.length),
    Option.getOrElse(() => 0),
  )

  const nextHegemony = {
    hegemonyWhite: currentHegemony.hegemonyWhite + nextHegemonyWhite,
    hegemonyBlack: currentHegemony.hegemonyBlack + nextHegemonyBlack,
  }

  const nextGame = {
    ...game,
    hegemony: nextHegemony,
  }
  return [nextGame, []]
}

const removePiecesInHomeRow = ([
  game,
  _positions,
]: BoardProgression): BoardProgression => {
  const { board } = game

  const nextBoard = pipe(
    board,
    Board.mapWithIndex((rowIdx, _colIdx, cell) => {
      const isBlackHomeRow = Player.homeRowIdx("Black") === rowIdx
      const isWhiteHomeRow = Player.homeRowIdx("White") === rowIdx
      const isBlackPiece = Cell.isPlayers("Black")(cell)
      const isWhitePiece = Cell.isPlayers("White")(cell)

      if (
        (isBlackHomeRow && isWhitePiece) ||
        (isWhiteHomeRow && isBlackPiece)
      ) {
        return Cell.empty
      } else {
        return cell
      }
    }),
  )

  const nextGame = {
    ...game,
    board: nextBoard,
  }

  return [nextGame, _positions]
}
