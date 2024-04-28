import { Option } from "effect"
import { Factory } from "fishery"

import { Board, Deck, Game, Hand, Supply } from "../src/model"

export const gameFactory = Factory.define<Game.Game>(() => {
  const game: Game.Game = {
    board: Board.initial,
    currentPlayer: "White",
    selectedCardIdx: Option.none(),
    deckWhite: Deck.initial,
    deckBlack: Deck.initial,
    handSize: Hand.initialHandSize,
    turnPoints: Game.initialTurnPoints,
    supply: Supply.initial,
    turnCount: 1,
    hegemony: Game.initialHegemony,
  }

  return game
})
