import { Either, Option, pipe } from "effect"

import { Board, Cell } from "./board"
import { Card } from "./deck"
import * as Game from "./game"
import * as Player from "./player"
import * as Position from "./position"
// ---- Validation Logic ----

type CardCostError = "NotEnoughStrategyPoints" | "NotEnoughTacticPoints"

export const validateHasCardCost =
  (card: Card.Card) =>
  (game: Game.Game): Either.Either<Game.Game, CardCostError> => {
    const [strategyCost, tacticCost] = Card.toPlayCost(card)
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
  | "InvalidAssaultNotOntoOtherPiece"
  | "InvalidManeuverOntoOtherPiece"
  | "InvalidManeuverOntoOwnPiece"
  | "InvalidManeuverOffBoard"
  | "InvalidChargeOntoOwnPiece"
  | "InvalidFlankLeftOntoOwnPiece"
  | "InvalidFlankLeftOffBoard"
  | "InvalidFlankRightOntoOwnPiece"
  | "InvalidFlankRightOffBoard"

export const playSelectPieceCard =
  (pos: Position.Position) =>
  (card: Card.Card) =>
  (game: Game.Game): Either.Either<Game.Game, PlayCardError> => {
    switch (card) {
      case "DeployHoplite":
        return playDeployHoplitePiece(pos)(game)
      case "ManeuverForward":
        return playManeuverForward(pos)(game)
      case "ManeuverRight":
        return playManeuverRight(pos)(game)
      case "ManeuverLeft":
        return playManeuverLeft(pos)(game)
      case "AssaultForward":
        return playAssaultForward(pos)(game)
      case "AssaultLeft":
        return playAssaultLeft(pos)(game)
      case "AssaultRight":
        return playAssaultRight(pos)(game)
      case "Charge":
        return playCharge(pos)(game)
      case "FlankLeft":
        return playFlankLeft(pos)(game)
      case "FlankRight":
        return playFlankRight(pos)(game)
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
      case "AssaultForward":
      case "AssaultLeft":
      case "AssaultRight":
      case "FlankLeft":
      case "FlankRight":
      case "Charge":
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

const playMilitaryReforms = (
  game: Game.Game,
): Either.Either<Game.Game, PlayCardError> => {
  return pipe(
    game,
    Game.increaseTurnPoints(Card.toPlayValue("MilitaryReforms")),
    Either.right,
  )
}

const playPoliticalReforms = (
  game: Game.Game,
): Either.Either<Game.Game, PlayCardError> => {
  return pipe(
    game,
    Game.increaseTurnPoints(Card.toPlayValue("PoliticalReforms")),
    Either.right,
  )
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

    const isOtherPiece = pipe(
      optionToCell,
      Option.map(Board.isPlayers(Player.toggle(player))),
      Option.getOrElse(() => false),
    )
    if (!isOtherPiece) {
      return Either.left("InvalidAssaultNotOntoOtherPiece")
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
    if (isOffBoard) {
      return Either.left("InvalidManeuverOffBoard")
    }

    const isOwnPiece = pipe(
      optionToCell,
      Option.map(Board.isPlayers(player)),
      Option.getOrElse(() => false),
    )
    if (isOwnPiece) {
      return Either.left("InvalidManeuverOntoOwnPiece")
    }

    const isOtherPiece = pipe(
      optionToCell,
      Option.map(Board.isPlayers(Player.toggle(player))),
      Option.getOrElse(() => false),
    )
    if (isOtherPiece) {
      return Either.left("InvalidManeuverOntoOtherPiece")
    }

    return pipe(
      game,
      Game.movePiece(from)(to),
      Game.consumeTacticPoint,
      Either.right,
    )
  }

export const playCharge =
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

    const to = moveForward(player, from)

    const optionToCell = Board.lookup(to.rowIdx)(to.colIdx)(game.board)

    const isOwnPiece = pipe(
      optionToCell,
      Option.map(Board.isPlayers(player)),
      Option.getOrElse(() => false),
    )
    if (isOwnPiece) {
      return Either.left("InvalidChargeOntoOwnPiece")
    }

    return pipe(
      game,
      Game.movePiece(from)(to),
      Game.consumeTacticPoint,
      Either.right,
    )
  }

export const playFlankLeft =
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

    const to = moveLeft(player, from)

    const optionToCell = Board.lookup(to.rowIdx)(to.colIdx)(game.board)

    const isOffBoard = Option.isNone(optionToCell)
    if (isOffBoard) {
      return Either.left("InvalidFlankLeftOffBoard")
    }

    const isOwnPiece = pipe(
      optionToCell,
      Option.map(Board.isPlayers(player)),
      Option.getOrElse(() => false),
    )
    if (isOwnPiece) {
      return Either.left("InvalidFlankLeftOntoOwnPiece")
    }

    return pipe(
      game,
      Game.movePiece(from)(to),
      Game.consumeTacticPoint,
      Either.right,
    )
  }

export const playFlankRight =
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

    const to = moveRight(player, from)

    const optionToCell = Board.lookup(to.rowIdx)(to.colIdx)(game.board)

    const isOffBoard = Option.isNone(optionToCell)
    if (isOffBoard) {
      return Either.left("InvalidFlankRightOffBoard")
    }

    const isOwnPiece = pipe(
      optionToCell,
      Option.map(Board.isPlayers(player)),
      Option.getOrElse(() => false),
    )
    if (isOwnPiece) {
      return Either.left("InvalidFlankRightOntoOwnPiece")
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

export const playManeuverForward = playManeuverDirection(moveForward)
export const playManeuverLeft = playManeuverDirection(moveLeft)
export const playManeuverRight = playManeuverDirection(moveRight)

export const playAssaultForward = playAssaultDirection(moveForward)
export const playAssaultLeft = playAssaultDirection(moveLeft)
export const playAssaultRight = playAssaultDirection(moveRight)

export const playDeployHoplitePiece =
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
