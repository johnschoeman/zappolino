import { Factory } from "fishery"

import { Board, Deck,Game } from "../src/model"

export const gameFactory = Factory.define<Game.Game>(() => {
  const game: Game.Game = {
    board: Board.initial,
    currentPlayer: "White",
    deckWhite: Deck.initial,
    deckBlack: Deck.initial
  }

  return game
})
