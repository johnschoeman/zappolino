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

setupGame()
