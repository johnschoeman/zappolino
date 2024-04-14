import { createSignal } from "solid-js"
import { pipe } from "effect"

import { Game } from "@app/model"

const setupGame = (): void => {
  pipe(game(), Game.endTurn, Game.endTurn, setGame)
}

export const [game, setGame] = createSignal<Game.Game>(Game.initial)

setupGame()
