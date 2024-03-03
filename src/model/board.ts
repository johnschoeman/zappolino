import { Option, pipe, ReadonlyArray, String } from "effect"

import * as Player from "./player"

// ---- Black ----
//     A B C D E
// 0 | - - - - - | 0
// 1 | - - - - - | 1
// 2 | - - - - - | 2
// 3 | - - - - - | 3
// 4 | - - - - - | 4
//     A B C D E
// ---- White ----

// Short Notation
// `
// --p--
// -----
// -----
// -----
// -P---
// `

export type Board<T> = Row<T>[]

export type Row<T> = T[]

export type Piece = { kind: "Piece"; player: Player.Player }
export type Empty = { kind: "Empty" }
export type Cell = Piece | Empty

export const cellBelongsTo =
  (player: Player.Player) =>
  (cell: Cell): boolean => {
    return foldCell(
      ({ player: piecePlayer }) => piecePlayer === player,
      () => false,
    )(cell)
  }

export const buildCell = (kind: "Empty" | "Black" | "White"): Cell => {
  switch (kind) {
    case "Empty":
      return { kind: "Empty" }
    case "Black":
      return buildPiece("Black")
    case "White":
      return buildPiece("White")
  }
}

export const buildRow = (
  template: ("Empty" | "Black" | "White")[],
): Row<Cell> => {
  return pipe(template, ReadonlyArray.map(buildCell))
}

export const buildPiece = (player: Player.Player): Piece => {
  return {
    kind: "Piece",
    player,
  }
}

const parseCell = (input: string): Cell => {
  switch (input) {
    case "-":
      return buildCell("Empty")
    case "p":
      return buildCell("Black")
    case "P":
      return buildCell("White")
    default:
      return buildCell("Empty")
  }
}

export const parse = (input: string): Board<Cell> => {
  const result: Board<Cell> = pipe(
    input,
    String.trim,
    String.split("\n"),
    ReadonlyArray.map(rowStr => {
      return pipe(rowStr, String.split(""), ReadonlyArray.map(parseCell))
    }),
  )

  return result
}

export const initial: Board<Cell> = [
  buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
  buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
  buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
  buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
  buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
]

export const foldCell =
  <T>(onPiece: (piece: Piece) => T, onEmpty: () => T) =>
  (cell: Cell): T => {
    switch (cell.kind) {
      case "Piece":
        return onPiece(cell)
      case "Empty":
        return onEmpty()
    }
  }

export const isPlayers = (player: Player.Player): ((cell: Cell) => boolean) =>
  foldCell(
    ({ player: piecePlayer }) => piecePlayer === player,
    () => false,
  )

export const emptyCell: Cell = { kind: "Empty" }

const emptyRow: Row<Cell> = [
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
  emptyCell,
]

export const empty: Board<Cell> = [
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
  emptyRow,
]

export const showStr = (board: Board<Cell>): string => {
  return show(showCell)(board)
}

export const show =
  <T>(showElement: (el: T) => string) =>
  (board: Board<T>): string => {
    return pipe(
      board,
      ReadonlyArray.map(row => {
        return pipe(row, ReadonlyArray.map(showElement), ReadonlyArray.join(""))
      }),
      ReadonlyArray.join("|"),
    )
  }

export const showCell = (cell: Cell): string => {
  return foldCell(
    ({ player }) => {
      return `${Player.show(player)}`
    },
    () => "-",
  )(cell)
}

export const movePiece =
  (fromRowIdx: number) =>
  (fromColIdx: number) =>
  (toRowIdx: number) =>
  (toColIdx: number) =>
  (board: Board<Cell>): Board<Cell> => {
    const piece: Cell = pipe(
      board,
      lookup(fromRowIdx)(fromColIdx),
      Option.getOrElse(() => emptyCell as Cell),
    )

    const result = pipe(
      board,
      modifyAt(toRowIdx)(toColIdx)(piece),
      modifyAt(fromRowIdx)(fromColIdx)(emptyCell),
    )

    return result
  }

export const lookup =
  (rowIdx: number) =>
  (colIdx: number) =>
  <T>(board: Board<T>): Option.Option<T> => {
    return pipe(
      board,
      ReadonlyArray.get(rowIdx),
      Option.flatMap(ReadonlyArray.get(colIdx)),
    )
  }

export const map =
  <T, U>(f: (cell: T) => U) =>
  (board: Board<T>): Board<U> => {
    return pipe(
      board,
      ReadonlyArray.map(row => {
        return pipe(
          row,
          ReadonlyArray.map(cell => {
            return f(cell)
          }),
        )
      }),
    )
  }

export const mapWithIndex =
  <T, U>(f: (rowIdx: number, colIdx: number, cell: T) => U) =>
  (board: Board<T>): Board<U> => {
    return pipe(
      board,
      ReadonlyArray.map((row, rowIdx) => {
        return pipe(
          row,
          ReadonlyArray.map((cell, colIdx) => {
            return f(rowIdx, colIdx, cell)
          }),
        )
      }),
    )
  }

export const reduceWithIndex =
  <A, B>(acc: B, f: (rowIdx: number, colIdx: number, b: B, a: A) => B) =>
  (board: Board<A>): B => {
    return pipe(
      board,
      ReadonlyArray.reduce(acc, (innerAcc, row, rowIdx) => {
        return pipe(
          row,
          ReadonlyArray.reduce(innerAcc, (acc_, cell, colIdx) => {
            return f(rowIdx, colIdx, acc_, cell)
          }),
        )
      }),
    )
  }

export const modifyAt =
  (rowIdx: number) =>
  (colIdx: number) =>
  (nextCell: Cell) =>
  (board: Board<Cell>): Board<Cell> => {
    return pipe(
      board,
      ReadonlyArray.modify(rowIdx, (row): Row<Cell> => {
        return pipe(
          row,
          ReadonlyArray.modify(colIdx, () => nextCell),
        )
      }),
    )
  }
