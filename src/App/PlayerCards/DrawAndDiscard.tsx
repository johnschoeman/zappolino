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

  const discardStyle = "p-2 rounded flex flex-row space-x-2"
  const cardStyle =
    "border rounded border-black bg-gray-200 justify-center items-center text-center"

  const handleOnClickDraw = (): void => {
    GameState.drawCard()
  }

  return (
    <div class={discardStyle}>
      <div data-testid="draw-pile">
        <h2 class="section-header">Draw Pile</h2>
        <div
          data-testid="draw-pile-count"
          class={cardStyle}
          onClick={handleOnClickDraw}
        >
          {pipe(draw(), Array.length)}
        </div>
      </div>

      <div data-testid="discard-pile">
        <h2 class="section-header">Discard Pile</h2>
        <div data-testid="discard-pile-count" class={cardStyle}>
          {pipe(disc(), Array.length)}
        </div>
      </div>
    </div>
  )
}

export default DrawAndDiscard
