import { Factory } from "fishery"

import { Game } from "../src/model"

export const gameFactory = Factory.define<Game.Game>(() => {
  const game: Game.Game = Game.initial

  return game
})
