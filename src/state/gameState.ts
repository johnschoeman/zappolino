import { createSignal } from "solid-js"
import { pipe } from "effect"

import { Deck, Game } from "@app/model"

const setupGame = (): void => {
  pipe(game(), setGame)
}

export const [game, setGame] = createSignal<Game.Game>(Game.initial)

export const currentPlayerDeck = (): Deck.Deck => {
  return pipe(game(), Game.currentPlayerDeck)
}

export const playedCards = (): Deck.Played => {
  return pipe(game(), Game.currentPlayerDeck, deck => deck.playedCards)
}

export const commitedResourceCards = (): Deck.Commited => {
  return pipe(game(), Game.currentPlayerDeck, deck => deck.commitedCards)
}

setupGame()
