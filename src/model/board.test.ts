import { expect, test } from "bun:test"

import * as Board from "./board"

test("Board.parse - when given a valid string notation, it returns a board", () => {
  const input = `
---p-
-----
-----
-----
-P---
`

  const result: Board.Board<Board.Cell> = Board.parse(input)

  const expected: Board.Board<Board.Cell> = [
    Board.buildRow(["Empty", "Empty", "Empty", "Black", "Empty"]),
    Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
    Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
    Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
    Board.buildRow(["Empty", "White", "Empty", "Empty", "Empty"]),
  ]

  expectBoardsToEqual(result, expected)
})

const expectBoardsToEqual = (
  boardA: Board.Board<Board.Cell>,
  boardB: Board.Board<Board.Cell>,
): void => {
  const boardAStr = Board.showStr(boardA)
  const boardBStr = Board.showStr(boardB)
  expect(boardAStr).toEqual(boardBStr)
}
