import { Factory } from "fishery"

import { Deck } from "../src/model"

export const deckFactory = Factory.define<Deck.Deck>(() => {
  const deck: Deck.Deck = {
    hand: [],
    draw: [],
    disc: [],
    playedCards: [],
    commitedCards: [],
  }

  return deck
})
