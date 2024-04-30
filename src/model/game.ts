import { Array, Option, pipe } from "effect"

import { Board, Cell } from "./board"
import { Card, Deck, Hand } from "./deck"
import * as Player from "./player"
import * as PointsPool from "./pointsPool"
import * as Position from "./position"
import * as Supply from "./supply"

const HEGEMONY_CROSSING = 5
const HEGEMONY_TAKING = 1

export type Game = {
  board: Board.Board<Cell.Cell>
  currentPlayer: Player.Player
  selectedCardIdx: Option.Option<number>
  turnPoints: PointsPool.PointsPool
  deckWhite: Deck.Deck
  deckBlack: Deck.Deck
  handSize: number
  supply: Supply.Supply
  turnCount: number
  hegemony: Hegemony
}

export type Hegemony = {
  hegemonyBlack: number
  hegemonyWhite: number
}

export const initialHegemony: Hegemony = {
  hegemonyWhite: 0,
  hegemonyBlack: 0,
}

export const initialTurnPoints: PointsPool.PointsPool = {
  hoplPts: 1,
  strtPts: 1,
  tactPts: 1,
  rescPts: 0,
  drawPts: 0,
}

export const initial: Game = {
  board: Board.empty,
  currentPlayer: "White",
  selectedCardIdx: Option.none(),
  turnPoints: initialTurnPoints,
  deckWhite: Deck.initial,
  deckBlack: Deck.initial,
  handSize: Hand.initialHandSize,
  supply: Supply.initial,
  turnCount: 1,
  hegemony: initialHegemony,
}

export const show = (game: Game): string => {
  const { board, currentPlayer } = game
  return `${Board.show(Cell.show)(board)} | player: ${currentPlayer}`
}

export const build = (
  deck: Deck.Deck,
  supply: Supply.Supply,
  handSize: number,
): Game => {
  return {
    ...initial,
    deckBlack: deck,
    deckWhite: deck,
    handSize,
    supply: supply,
  }
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

const updateBoard =
  (board: Board.Board<Cell.Cell>) =>
  (game: Game): Game => {
    return { ...game, board }
  }

const addHegemonyForCurrentPlayer =
  (points: number) =>
  (game: Game): Game => {
    const { currentPlayer, hegemony } = game
    const nextHegemony = { ...hegemony }

    switch (currentPlayer) {
      case "Black":
        nextHegemony.hegemonyBlack = hegemony.hegemonyBlack + points
        break
      case "White":
        nextHegemony.hegemonyWhite = hegemony.hegemonyWhite + points
        break
    }

    return { ...game, hegemony: nextHegemony }
  }

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
    strtPts: turnPoints.strtPts - 1,
  }
  return {
    ...game,
    turnPoints: nextTurnPoints,
  }
}

export const decreaseTurnPoints =
  (pointsPool: PointsPool.PointsPool) =>
  (game: Game): Game => {
    return {
      ...game,
      turnPoints: PointsPool.decreaseBy(pointsPool)(game.turnPoints),
    }
  }

const increaseResourcePoints =
  (count: number) =>
  (game: Game): Game => {
    return increaseTurnPoints(PointsPool.build({ rescPts: count }))(game)
  }

export const consumeResourcePoints =
  (count: number) =>
  (game: Game): Game => {
    return decreaseTurnPoints(PointsPool.build({ rescPts: count }))(game)
  }

export const increaseTurnPoints =
  (pointsPool: PointsPool.PointsPool) =>
  (game: Game): Game => {
    return {
      ...game,
      turnPoints: PointsPool.increaseBy(pointsPool)(game.turnPoints),
    }
  }

export const consumeHoplitePoint = (game: Game): Game => {
  return {
    ...game,
    turnPoints: PointsPool.consumeHoplitePoint(game.turnPoints),
  }
}

export const consumeTacticPoint = (game: Game): Game => {
  return {
    ...game,
    turnPoints: PointsPool.consumeTacticPoint(game.turnPoints),
  }
}

export const consumeDrawPoint = (game: Game): Game => {
  return {
    ...game,
    turnPoints: PointsPool.consumeDrawPoint(game.turnPoints),
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
    increaseResourcePoints(resourceValue),
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

export const progressBoard = (game: Game): Game => {
  const nextGame = pipe(
    game,
    progressEachColumn,
    addHegemonyPoints,
    removePiecesInHomeRow,
  )

  return nextGame
}

type Points = number
export type ColumnProgression = [Board.Column<Cell.Cell>, Points]
type BoardProgression = [Board.Board<Cell.Cell>, Points]

const progressEachColumn = (game: Game): Game => {
  const { board } = game

  const nextGame = pipe(
    board,
    Board.transpose,
    Array.map(progressColumn(game.currentPlayer)),
    Array.reduce<BoardProgression, ColumnProgression>(
      [[], 0],
      ([accBoard, accPoints], [col, colPoints]) => {
        const nextBoard = pipe(accBoard, Array.append(col))
        const nextPoints = accPoints + colPoints
        return [nextBoard, nextPoints]
      },
    ),
    ([board_, points]) => {
      const nextBoard = Board.transpose(board_)
      return pipe(
        game,
        updateBoard(nextBoard),
        addHegemonyForCurrentPlayer(points),
      )
    },
  )

  return nextGame
}

// progressColumn
//
// Move pieces for the current player forward if the file depth of a continuous
// length of pieces is deeper than the opponents pieces.

const orientColumnFor =
  (player: Player.Player) =>
  (column: Board.Column<Cell.Cell>): Board.Column<Cell.Cell> => {
    return player === "Black" ? Array.reverse(column) : column
  }

const determineIsDepthGreater = (
  column: Board.Column<Cell.Cell>,
  player: Player.Player,
  evaluateIdx: number,
): boolean => {
  return pipe(column, Array.splitAt(evaluateIdx), ([left, right]) => {
    const leftDepth = pipe(
      left,
      Array.reverse,
      Array.takeWhile((_cell, _idx) => Cell.isOpponents(player)(_cell)),
      Array.length,
    )
    const rightDepth = pipe(
      right,
      Array.takeWhile((_cell, _idx) => Cell.isPlayers(player)(_cell)),
      Array.length,
    )

    return rightDepth > leftDepth
  })
}

const movePlayerPiece = (
  col: Board.Column<Cell.Cell>,
  player: Player.Player,
  idx: number,
): Board.Column<Cell.Cell> => {
  return pipe(
    col,
    Array.modify(idx - 1, () => Cell.buildPiece(player)),
    Array.modify(idx, () => Cell.empty),
  )
}

const evaluateAndMoveFor =
  (player: Player.Player) =>
  (
    [col, points]: ColumnProgression,
    cell: Cell.Cell,
    idx: number,
  ): ColumnProgression => {
    const isPlayersCell = Cell.isPlayers(player)(cell)
    const adjacentCell = pipe(
      col,
      Array.get(idx - 1),
      Option.getOrElse(() => Cell.empty),
    )
    const isAdjacentCellPlayers = Cell.isPlayers(player)(adjacentCell)

    if (!isPlayersCell || isAdjacentCellPlayers) {
      return [col, points]
    }

    const isAdjacentCellEmpty = Cell.isEmpty(adjacentCell)
    const isDepthGreater = determineIsDepthGreater(col, player, idx)

    const determineNextCol = (): Board.Column<Cell.Cell> => {
      if (isAdjacentCellEmpty || isDepthGreater) {
        return movePlayerPiece(col, player, idx)
      } else {
        return col
      }
    }

    const determineNextPoints = (): number => {
      if (isDepthGreater && !isAdjacentCellEmpty) {
        return points + HEGEMONY_TAKING
      } else {
        return points
      }
    }

    const nextCol = determineNextCol()
    const nextPoints = determineNextPoints()
    return [nextCol, nextPoints]
  }

export const progressColumn =
  (player: Player.Player) =>
  (column: Board.Column<Cell.Cell>): ColumnProgression => {
    const orientedColumn = orientColumnFor(player)(column)
    const [processedColumn, points] = Array.reduce<
      ColumnProgression,
      Cell.Cell
    >(
      [orientedColumn, 0],
      evaluateAndMoveFor(player),
    )(orientedColumn)

    return [orientColumnFor(player)(processedColumn), points]
  }

const addHegemonyPoints = (game: Game): Game => {
  const { board } = game

  const currentHegemony = game.hegemony

  const nextHegemonyWhite = pipe(
    board,
    Array.get(Player.homeRowIdx("Black")),
    Option.map(Array.filter(Cell.isPlayers("White"))),
    Option.map(Array.length),
    Option.map(count => count * HEGEMONY_CROSSING),
    Option.getOrElse(() => 0),
  )

  const nextHegemonyBlack = pipe(
    board,
    Array.get(Player.homeRowIdx("White")),
    Option.map(Array.filter(Cell.isPlayers("Black"))),
    Option.map(Array.length),
    Option.map(count => count * HEGEMONY_CROSSING),
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
  return nextGame
}

const removePiecesInHomeRow = (game: Game): Game => {
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

  return nextGame
}
