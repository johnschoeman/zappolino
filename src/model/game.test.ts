import { expect, test } from "bun:test"

import * as Board from "./board"
import * as Game from "./game"

test("Game.progress - It progress the correct pieces forward and changes the current player", () => {
    const step1: Game.Game = {
      board: [
        Board.buildRow(["Empty", "Black", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "White", "Empty"]),
      ],
      currentPlayer: "White",
    }

    const step2: Game.Game = {
      board: [
        Board.buildRow(["Empty", "Black", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "White", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
      ],
      currentPlayer: "Black",
    }

    const step3: Game.Game = {
      board: [
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Black", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "White", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
      ],
      currentPlayer: "White",
    }

    const resultA = Game.progress(step1)
    const resultB = Game.progress(step2)

    expectGameToMatch(resultA, step2)
    expectGameToMatch(resultB, step3)
})

test("Game.addPiece - it only allows new pieces on the home row", () => {
    const gameWhite: Game.Game = {
      board: [
        Board.buildRow(["Empty", "Black", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "White", "Empty"]),
      ],
      currentPlayer: "White",
    }

    const gameBlack: Game.Game = {
      board: [
        Board.buildRow(["Empty", "Black", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "White", "Empty"]),
      ],
      currentPlayer: "Black",
    }

    const pos1 = { rowIdx: 4, colIdx: 0 }

    const expected1: Game.Game = {
      board: [
        Board.buildRow(["Empty", "Black", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["White", "Empty", "Empty", "White", "Empty"]),
      ],
      currentPlayer: "White",
    }

    const result1 = Game.addPiece(pos1.rowIdx)(pos1.colIdx)(gameWhite)

    expectGameToMatch(result1, expected1)

    const pos2 = { rowIdx: 3, colIdx: 0 }

    const expected2: Game.Game = {
      board: [
        Board.buildRow(["Empty", "Black", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "White", "Empty"]),
      ],
      currentPlayer: "White",
    }

    const result2 = Game.addPiece(pos2.rowIdx)(pos2.colIdx)(gameWhite)

    expectGameToMatch(result2, expected2)

    const pos3 = { rowIdx: 0, colIdx: 2 }

    const expected3: Game.Game = {
      board: [
        Board.buildRow(["Empty", "Black", "Black", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "Empty", "Empty"]),
        Board.buildRow(["Empty", "Empty", "Empty", "White", "Empty"]),
      ],
      currentPlayer: "Black",
    }

    const result3 = Game.addPiece(pos3.rowIdx)(pos3.colIdx)(gameBlack)

    expectGameToMatch(result3, expected3)
})


const expectGameToMatch = (gameA: Game.Game, gameB: Game.Game) => {
    const gameAText = Game.show(gameA)
    const gameBText = Game.show(gameB)

    expect(gameAText).toBe(gameBText)
}
