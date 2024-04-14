import { Either, Option, pipe, ReadonlyArray } from "effect"

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
}

type TurnPoints = {
  strategyPoints: number
  tacticPoints: number
}

const initalTurnPoints: TurnPoints = {
  strategyPoints: 1,
  tacticPoints: 1,
}

export const initial: Game = {
  board: Board.empty,
  currentPlayer: "White",
  selectedCardIdx: Option.none(),
  turnPoints: initalTurnPoints,
  deckWhite: Deck.initial,
  deckBlack: Deck.initial,
  supply: Supply.initial,
}

export const show = (game: Game): string => {
  const { board, currentPlayer } = game
  return `${Board.show(Cell.show)(board)} | player: ${currentPlayer}`
}

// ---- User Actions ----

export const selectSupplyPile =
  (supplyPileIdx: number) =>
  (game: Game): Game => {
    const currentPlayer = game.currentPlayer
    const supply = game.supply
    const optionSupplyPile = pipe(supply, ReadonlyArray.get(supplyPileIdx))

    if (Option.isNone(optionSupplyPile)) {
      return game
    }

    const supplyPile = optionSupplyPile.value
    const { card, count } = supplyPile

    if (count === 0) {
      return game
    }

    const strategyPoints = game.turnPoints.strategyPoints

    if (strategyPoints < 1) {
      return game
    }

    const deck = deckFor(currentPlayer)(game)

    const nextDeck = Deck.addCardToDiscard(card)(deck)

    const nextSupplyPile: Supply.SupplyPile = {
      ...supplyPile,
      count: supplyPile.count - 1,
    }

    const nextSupply: Supply.Supply = [...supply]
    nextSupply[supplyPileIdx] = nextSupplyPile

    return pipe(
      game,
      updateDeckFor(currentPlayer)(nextDeck),
      consumeStrategyPoint,
      updateSupply(nextSupply),
    )
  }

export const selectHandCard =
  (cardIdx: number) =>
  (game: Game): Game => {
    return {
      ...game,
      selectedCardIdx: Option.some(cardIdx),
    }
  }

export const selectCell =
  ({ rowIdx, colIdx }: Position.Position) =>
  (game: Game): Game => {
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

    return pipe(
      game,
      validateHasCardCost(card.value),
      Either.andThen(playCard({ rowIdx, colIdx })(card.value)),
      Either.map(playSelectedCard),
      Either.match({
        onLeft: () => game,
        onRight: nextGame => nextGame,
      }),
    )
  }

export const endTurn = (game: Game): Game => {
  const player = game.currentPlayer
  const playerDeck = currentPlayerDeck(game)
  const nextDeck = pipe(
    playerDeck,
    Deck.discardPlayed,
    Deck.discardHand,
    Deck.draw(5),
  )

  const result = pipe(
    game,
    updateDeckFor(player)(nextDeck),
    progressBoard,
    unselectHandCard,
    togglePlayer,
    resetTurnPoints,
  )

  return result
}

const unselectHandCard = (game: Game): Game => {
  return {
    ...game,
    selectedCardIdx: Option.none(),
  }
}

// ---- Getters ----

export const currentPlayerDeck = (game: Game): Deck.Deck => {
  return deckFor(game.currentPlayer)(game)
}

const deckFor =
  (player: Player.Player) =>
  (game: Game): Deck.Deck => {
    switch (player) {
      case "White":
        return game.deckWhite
      case "Black":
        return game.deckBlack
    }
  }

// ---- Setters ----

const updateSupply =
  (supply: Supply.Supply) =>
  (game: Game): Game => {
    return {
      ...game,
      supply,
    }
  }

// ---- Validation Logic ----

type CardCostError = "NotEnoughStrategyPoints" | "NotEnoughTacticPoints"

export const validateHasCardCost =
  (card: Card.Card) =>
  (game: Game): Either.Either<Game, CardCostError> => {
    const [strategyCost, tacticCost] = Card.toCost(card)
    const { strategyPoints, tacticPoints } = game.turnPoints

    if (strategyCost > strategyPoints) {
      return Either.left("NotEnoughStrategyPoints")
    }
    if (tacticCost > tacticPoints) {
      return Either.left("NotEnoughTacticPoints")
    }
    return Either.right(game)
  }

// ---- Playing Cards ----

type PlayCardError =
  | "InvalidCell"
  | "InvalidPlacement"
  | "InvalidPieceSelection"
  | "InvalidDestination"

const playCard =
  (pos: Position.Position) =>
  (card: Card.Card) =>
  (game: Game): Either.Either<Game, PlayCardError> => {
    switch (card) {
      case "Place":
        return playPlacePieceCard(pos)(game)
      case "MoveForward":
        return playMoveForwardCard(pos)(game)
      case "MoveRight":
        return playMoveRightCard(pos)(game)
      case "MoveLeft":
        return playMoveLeftCard(pos)(game)
      case "Oracle":
      case "Flank":
      case "Charge":
      case "Retreat":
      case "MilitaryReforms":
      case "PoliticalReforms":
        return playPlacePieceCard(pos)(game)
    }
  }

const isValidRowForPlayer =
  (player: Player.Player) =>
  (rowIdx: number): boolean => {
    switch (player) {
      case "Black":
        return rowIdx === 0
      case "White":
        return rowIdx === 4
    }
  }

type MoveToFn = (
  player: Player.Player,
  from: Position.Position,
) => Position.Position
export const playMoveDirection =
  (buildMoveTo: MoveToFn) =>
  (from: Position.Position) =>
  (game: Game): Either.Either<Game, PlayCardError> => {
    const player = game.currentPlayer
    const { rowIdx, colIdx } = from
    const optionCell = Board.lookup(rowIdx)(colIdx)(game.board)

    if (Option.isNone(optionCell)) {
      return Either.left("InvalidCell")
    }

    const cell = optionCell.value

    const isPiecePresent = Board.isPlayers(player)(cell)
    const isValid = isPiecePresent

    if (!isValid) {
      return Either.left("InvalidPieceSelection")
    }

    const to = buildMoveTo(player, from)

    const optionToCell = Board.lookup(to.rowIdx)(to.colIdx)(game.board)
    const isOffBoard = Option.isNone(optionToCell)
    const isOwnPiece = pipe(
      optionToCell,
      Option.map(Board.isPlayers(player)),
      Option.getOrElse(() => false),
    )
    if (isOffBoard || isOwnPiece) {
      return Either.left("InvalidDestination")
    }

    return pipe(game, movePiece(from)(to), consumeTacticPoint, Either.right)
  }

const moveLeft = (
  player: Player.Player,
  from: Position.Position,
): Position.Position => {
  const { rowIdx, colIdx } = from
  switch (player) {
    case "Black":
      return { rowIdx, colIdx: colIdx + 1 }
    case "White":
      return { rowIdx, colIdx: colIdx - 1 }
  }
}

const moveRight = (
  player: Player.Player,
  from: Position.Position,
): Position.Position => {
  const { rowIdx, colIdx } = from
  switch (player) {
    case "Black":
      return { rowIdx: rowIdx, colIdx: colIdx - 1 }
    case "White":
      return { rowIdx: rowIdx, colIdx: colIdx + 1 }
  }
}

const moveForward = (
  player: Player.Player,
  from: Position.Position,
): Position.Position => {
  const { rowIdx, colIdx } = from
  switch (player) {
    case "Black":
      return { rowIdx: rowIdx + 1, colIdx }
    case "White":
      return { rowIdx: rowIdx - 1, colIdx }
  }
}

export const playMoveForwardCard = playMoveDirection(moveForward)
export const playMoveLeftCard = playMoveDirection(moveLeft)
export const playMoveRightCard = playMoveDirection(moveRight)

export const playPlacePieceCard =
  ({ rowIdx, colIdx }: Position.Position) =>
  (game: Game): Either.Either<Game, PlayCardError> => {
    const player = game.currentPlayer
    const optionCell = Board.lookup(rowIdx)(colIdx)(game.board)

    if (Option.isNone(optionCell)) {
      return Either.left("InvalidCell")
    }

    const cell = optionCell.value

    const isValidRow = isValidRowForPlayer(player)(rowIdx)
    const isNoPiecePresent = Cell.isEmpty(cell)
    const isValid = isValidRow && isNoPiecePresent

    if (!isValid) {
      return Either.left("InvalidPlacement")
    }

    return pipe(
      game,
      addPiece(rowIdx)(colIdx),
      consumeStrategyPoint,
      Either.right,
    )
  }

const consumeStrategyPoint = (game: Game): Game => {
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

const consumeTacticPoint = (game: Game): Game => {
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

export const playSelectedCard = (game: Game): Game => {
  const player = game.currentPlayer
  const deck = currentPlayerDeck(game)
  const nextDeck = pipe(
    game.selectedCardIdx,
    Option.map(cardIdx => Deck.playCard(cardIdx)(deck)),
    Option.getOrElse(() => deck),
  )
  const nextGame = pipe(game, updateDeckFor(player)(nextDeck), unselectHandCard)
  return nextGame
}

const updateDeckFor =
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

const resetTurnPoints = (game: Game): Game => {
  return {
    ...game,
    turnPoints: initalTurnPoints,
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

  const nextGame = {
    ...game,
    board: nextBoard,
  }
  return [nextGame, []]
}

const togglePlayer = (game: Game): Game => {
  const { currentPlayer } = game
  return {
    ...game,
    currentPlayer: Player.toggle(currentPlayer),
  }
}
