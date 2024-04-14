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
    turnPoints: {
      strategyPoints: 1,
      tacticPoints: 1,
    },
    supply: Supply.initial,
  }

  return game
})