import { Option } from "effect"
import { Factory } from "fishery"

import { Board, Deck, Game, Supply } from "../src/model"

export const gameFactory = Factory.define<Game.Game>(() => {
  const game: Game.Game = {
    board: Board.initial,
    currentPlayer: "White",
    selectedCardIdx: Option.none(),
    deckWhite: Deck.initial,
    deckBlack: Deck.initial,
    turnPoints: Game.initialTurnPoints,
    supply: Supply.initial,
    turnCount: 1,
    hegemonyBlack: 0,
    hegemonyWhite: 0,
  }

  return game
})
