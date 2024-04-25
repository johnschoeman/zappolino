import { Match } from "effect"

import * as Player from "../player"

export type Piece = { _tag: "Piece"; player: Player.Player }
export type Empty = { _tag: "Empty" }
export const empty: Cell = { _tag: "Empty" }

export type Cell = Piece | Empty

export type CellId = string

export const match = Match.type<Cell>()

export const build = (kind: "Empty" | "Black" | "White"): Cell => {
  switch (kind) {
    case "Empty":
      return empty
    case "Black":
      return buildPiece("Black")
    case "White":
      return buildPiece("White")
  }
}

export const isEmpty = (cell: Cell): boolean => {
  return match.pipe(
    Match.tag("Empty", () => true),
    Match.tag("Piece", () => false),
    Match.exhaustive,
  )(cell)
}

export const isPlayers =
  (p: Player.Player) =>
  (cell: Cell): boolean => {
    return match.pipe(
      Match.tag("Empty", () => false),
      Match.tag("Piece", ({ player }) => {
        return player === p
      }),
      Match.exhaustive,
    )(cell)
  }

export const isOpponents =
  (p: Player.Player) =>
  (cell: Cell): boolean => {
    return match.pipe(
      Match.tag("Empty", () => false),
      Match.tag("Piece", ({ player }) => {
        return player !== p
      }),
      Match.exhaustive,
    )(cell)
  }

export const buildPiece = (player: Player.Player): Piece => {
  return {
    _tag: "Piece",
    player,
  }
}

export const parse = (input: string): Cell => {
  switch (input) {
    case "-":
      return build("Empty")
    case "p":
      return build("Black")
    case "P":
      return build("White")
    default:
      return build("Empty")
  }
}

export const show = (cell: Cell): string => {
  return match.pipe(
    Match.tag("Empty", () => "-"),
    Match.tag("Piece", ({ player }) => {
      switch (player) {
        case "White":
          return "P"
        case "Black":
          return "p"
      }
    }),
    Match.exhaustive,
  )(cell)
}

export const belongsTo =
  (player: Player.Player) =>
  (cell: Cell): boolean => {
    return match.pipe(
      Match.tag("Empty", () => false),
      Match.tag("Piece", ({ player: piecePlayer }) => piecePlayer === player),
      Match.exhaustive,
    )(cell)
  }
