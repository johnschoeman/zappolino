import { pipe, ReadonlyArray } from "effect"

export type Board = Row[]

type Row = Cell[]

type Cell = "Filled" | "Empty"

const emptyRow: Row = ["Empty", "Empty", "Empty", "Empty", "Empty"]

export const empty: Board = [emptyRow, emptyRow, emptyRow, emptyRow, emptyRow]

export const show = (board: Board): string => {
  return pipe(
    board,
    ReadonlyArray.map(ReadonlyArray.join("-")),
    ReadonlyArray.join("|"),
  )
}

export const update =
  (rowIdx: number) =>
  (colIdx: number) =>
  (nextCell: Cell) =>
  (board: Board): Board => {
    return pipe(
      board,
      ReadonlyArray.modify(rowIdx, (row: Row): Row => {
        return pipe(
          row,
          ReadonlyArray.modify(colIdx, () => nextCell),
        )
      }),
    )
  }
