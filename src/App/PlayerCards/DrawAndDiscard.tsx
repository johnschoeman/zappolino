import { JSX } from "solid-js"
import { Array, pipe } from "effect"

import { Deck } from "@app/model"
import { GameState } from "@app/state"

const DrawAndDiscard = (): JSX.Element => {
  const disc = (): Deck.Disc => {
    return pipe(GameState.currentPlayerDeck(), deck => deck.disc)
  }

  const draw = (): Deck.Draw => {
    return pipe(GameState.currentPlayerDeck(), deck => deck.draw)
  }

  const discardStyle = "p-2 border rounded flex flex-row space-x-2"
  const cardStyle =
    "border rounded border-black bg-gray-200 justify-center items-center text-center"

  return (
    <div class={discardStyle}>
      <div data-testid="draw-pile">
        <h2>Draw Pile</h2>
        <div data-testid="draw-pile-count" class={cardStyle}>
          {pipe(draw(), Array.length)}
        </div>
      </div>

      <div data-testid="discard-pile">
        <h2>Discard Pile</h2>
        <div data-testid="discard-pile-count" class={cardStyle}>
          {pipe(disc(), Array.length)}
        </div>
      </div>
    </div>
  )
}

export default DrawAndDiscard
