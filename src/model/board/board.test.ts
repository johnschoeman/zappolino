import { expect, test } from "bun:test"

import * as Board from "./board"
import * as Cell from "./cell"

test("Board.parse - when given a valid string notation, it returns a board", () => {
  const input = `
---p-
-----
-----
-----
-P---
`

  const result: Board.Board<Cell.Cell> = Board.parse(input)

  const expected: Board.Board<Cell.Cell> = [
    Board.buildRow(["Empty", "Empty", "Empty", "Black", "Empty"]),
    Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
    Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
    Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
    Board.buildRow(["Empty", "White", "Empty", "Empty", "Empty"]),
  ]

  expectBoardsToEqual(result, expected)
})

const expectBoardsToEqual = (
  boardA: Board.Board<Cell.Cell>,
  boardB: Board.Board<Cell.Cell>,
): void => {
  const boardAStr = Board.showStr(boardA)
  const boardBStr = Board.showStr(boardB)
  expect(boardAStr).toEqual(boardBStr)
}
