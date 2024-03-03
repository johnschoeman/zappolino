import { Factory } from "fishery"

import { Game, Board } from "../src/model"

export const gameFactory = Factory.define<Game.Game>(() => {
  const game: Game.Game = {
    board: Board.initial,
    currentPlayer: "White",
  }

  return game
})
