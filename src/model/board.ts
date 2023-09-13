import { A, F, O, S } from "@app/fpts"

export type Board = Row[]

type Row = Cell[]

type Cell = "Filled" | "Empty"

const emptyRow: Row = ["Empty", "Empty", "Empty", "Empty", "Empty"]

export const empty: Board = [emptyRow, emptyRow, emptyRow, emptyRow, emptyRow]

export const show = (board: Board): string => {
  return F.pipe(
    board,
    A.map(A.intercalate(S.Monoid)("-")),
    A.intercalate(S.Monoid)("|"),
  )
}

export const update =
  (rowIdx: number) =>
  (colIdx: number) =>
  (nextCell: Cell) =>
  (board: Board): Board => {
    return F.pipe(
      board,
      A.modifyAt(rowIdx, (row): Row => {
        return F.pipe(
          row,
          A.modifyAt(colIdx, () => nextCell),
          O.getOrElse(() => emptyRow),
        )
      }),
      O.getOrElse(() => empty),
    )
  }
