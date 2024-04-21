import { Match, Option, pipe, ReadonlyArray, String } from "effect"

import * as Player from "../player"

import * as Cell from "./cell"

// ---- Black ----
//     A B C D E
// 0 | - - - - - | 0
// 1 | - - - - - | 1
// 2 | - - - - - | 2
// 3 | - - - - - | 3
// 4 | - - - - - | 4
// 5 | - - - - - | 5
// 6 | - - - - - | 6
//     A B C D E
// ---- White ----

// Short Notation
// `
// --p--
// -----
// -----
// -----
// -P---
// -----
// -----
// `

export const BOARD_ROWS = 7
export const BOARD_COLS = 5

export type Board<T> = Row<T>[]

export type Row<T> = T[]

export type CellWithPos = { cell: Cell.Cell; rowIdx: number; colIdx: number }

export const buildRow = (
  template: ("Empty" | "Black" | "White")[],
): Row<Cell.Cell> => {
  return pipe(template, ReadonlyArray.map(Cell.build))
}

export const parse = (input: string): Board<Cell.Cell> => {
  const result: Board<Cell.Cell> = pipe(
    input,
    String.trim,
    String.split("\n"),
    ReadonlyArray.map(rowStr => {
      return pipe(rowStr, String.split(""), ReadonlyArray.map(Cell.parse))
    }),
  )

  return result
}

export const isPlayers = (
  player: Player.Player,
): ((cell: Cell.Cell) => boolean) =>
  Cell.match.pipe(
    Match.tag("Piece", ({ player: piecePlayer }) => piecePlayer === player),
    Match.tag("Empty", () => false),
    Match.exhaustive,
  )

export const empty: Board<Cell.Cell> = pipe(
  ReadonlyArray.range(0, BOARD_ROWS - 1),
  ReadonlyArray.map(_rowIdx => {
    return buildRow(
      pipe(
        ReadonlyArray.range(0, BOARD_COLS - 1),
        ReadonlyArray.map(_colIdx => "Empty"),
      ),
    )
  }),
)

export const initial: Board<Cell.Cell> = empty

export const homeRowIdx = (player: Player.Player): number => {
  switch (player) {
    case "White":
      return BOARD_ROWS - 1
    case "Black":
      return 0
  }
}

export const showStr = (board: Board<Cell.Cell>): string => {
  return show(Cell.show)(board)
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

export const movePiece =
  (fromRowIdx: number) =>
  (fromColIdx: number) =>
  (toRowIdx: number) =>
  (toColIdx: number) =>
  (board: Board<Cell.Cell>): Board<Cell.Cell> => {
    const piece: Cell.Cell = pipe(
      board,
      lookup(fromRowIdx)(fromColIdx),
      Option.getOrElse(() => Cell.empty),
    )

    const result = pipe(
      board,
      modifyAt(toRowIdx)(toColIdx)(piece),
      modifyAt(fromRowIdx)(fromColIdx)(Cell.empty),
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
  (nextCell: Cell.Cell) =>
  (board: Board<Cell.Cell>): Board<Cell.Cell> => {
    return pipe(
      board,
      ReadonlyArray.modify(rowIdx, (row): Row<Cell.Cell> => {
        return pipe(
          row,
          ReadonlyArray.modify(colIdx, () => nextCell),
        )
      }),
    )
  }
