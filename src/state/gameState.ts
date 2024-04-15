import { createSignal } from "solid-js"
import { pipe } from "effect"

import { Deck, Game, GameAction } from "@app/model"

const setupGame = (): void => {
  pipe(game(), GameAction.endTurn, GameAction.endTurn, setGame)
}

export const [game, setGame] = createSignal<Game.Game>(Game.initial)

export const currentPlayerDeck = (): Deck.Deck => {
  return pipe(game(), Game.currentPlayerDeck)
}

setupGame()
