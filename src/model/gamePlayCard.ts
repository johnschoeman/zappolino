import { Either, Option, pipe } from "effect"

import * as Game from "./game"
import { Board, Cell } from "./board"
import * as Player from "./player"
import * as Position from "./position"
import { Card } from "./deck"

// ---- Validation Logic ----

type CardCostError = "NotEnoughStrategyPoints" | "NotEnoughTacticPoints"

export const validateHasCardCost =
  (card: Card.Card) =>
  (game: Game.Game): Either.Either<Game.Game, CardCostError> => {
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
  | "InvalidPlayMatSelection"
  | "InvalidAssaultDestination"
  | "InvalidManeuverDestination"

export const playSelectPieceCard =
  (pos: Position.Position) =>
  (card: Card.Card) =>
  (game: Game.Game): Either.Either<Game.Game, PlayCardError> => {
    switch (card) {
      case "DeployHoplite":
        return playDeployHoplitePieceCard(pos)(game)
      case "ManeuverForward":
        return playManeuverForwardCard(pos)(game)
      case "ManeuverRight":
        return playManeuverRightCard(pos)(game)
      case "ManeuverLeft":
        return playManeuverLeftCard(pos)(game)
      case "Flank":
        return playFlank(pos)("Left")(game)
      case "Charge":
        return playCharge(game)
      case "Retreat":
        return playRetreat(game)
      case "MilitaryReforms":
      case "PoliticalReforms":
      case "Oracle":
        return Either.left("InvalidPieceSelection")
    }
  }

export const playSelectMatCard =
  (card: Card.Card) =>
  (game: Game.Game): Either.Either<Game.Game, PlayCardError> => {
    switch (card) {
      case "MilitaryReforms":
        return playMilitaryReforms(game)
      case "PoliticalReforms":
        return playPoliticalReforms(game)
      case "Oracle":
        return playOracle(game)
      case "DeployHoplite":
      case "ManeuverForward":
      case "ManeuverRight":
      case "ManeuverLeft":
      case "Flank":
      case "Charge":
      case "Retreat":
        return Either.left("InvalidPlayMatSelection")
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

// --- Play Card Functions

const playFlank =
  (_from: Position.Position) =>
  (_direction: "Left" | "Right") =>
  (game: Game.Game): Either.Either<Game.Game, PlayCardError> => {
    return pipe(game, Either.right)
  }

const playCharge = (
  game: Game.Game,
): Either.Either<Game.Game, PlayCardError> => {
  return pipe(game, Either.right)
}

const playRetreat = (
  game: Game.Game,
): Either.Either<Game.Game, PlayCardError> => {
  return pipe(game, Either.right)
}

const playMilitaryReforms = (
  game: Game.Game,
): Either.Either<Game.Game, PlayCardError> => {
  return pipe(game, Game.increaseTacticPoints(3), Either.right)
}

const playPoliticalReforms = (
  game: Game.Game,
): Either.Either<Game.Game, PlayCardError> => {
  return pipe(game, Game.increaseStrategyPoints(2), Either.right)
}

const playOracle = (
  game: Game.Game,
): Either.Either<Game.Game, PlayCardError> => {
  return pipe(game, Either.right)
}

// Move - Move from one position to another, without validation

// Assault - Move piece, but only allowed to take other players piece

// Maneuver - Move piece, but not allowed to take any other piece

type MoveToFn = (
  player: Player.Player,
  from: Position.Position,
) => Position.Position

export const playAssaultDirection =
  (buildMoveTo: MoveToFn) =>
  (from: Position.Position) =>
  (game: Game.Game): Either.Either<Game.Game, PlayCardError> => {
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
      return Either.left("InvalidAssaultDestination")
    }

    return pipe(
      game,
      Game.movePiece(from)(to),
      Game.consumeTacticPoint,
      Either.right,
    )
  }

export const playManeuverDirection =
  (buildMoveTo: MoveToFn) =>
  (from: Position.Position) =>
  (game: Game.Game): Either.Either<Game.Game, PlayCardError> => {
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
      return Either.left("InvalidManeuverDestination")
    }

    return pipe(
      game,
      Game.movePiece(from)(to),
      Game.consumeTacticPoint,
      Either.right,
    )
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

export const playManeuverForwardCard = playManeuverDirection(moveForward)
export const playManeuverLeftCard = playManeuverDirection(moveLeft)
export const playManeuverRightCard = playManeuverDirection(moveRight)

export const playDeployHoplitePieceCard =
  ({ rowIdx, colIdx }: Position.Position) =>
  (game: Game.Game): Either.Either<Game.Game, PlayCardError> => {
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
      Game.addPiece(rowIdx)(colIdx),
      Game.consumeStrategyPoint,
      Either.right,
    )
  }
