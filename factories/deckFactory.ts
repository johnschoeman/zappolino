import { Factory } from "fishery"
import { Option } from "effect"

import { Deck } from "../src/model"

export const deckFactory = Factory.define<Deck.Deck>(() => {
  const deck: Deck.Deck = {
    hand: [],
    draw: [],
    disc: [],
    selectedCardIdx: Option.none(),
    playedCards: [],
  }

  return deck
})
