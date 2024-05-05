import { JSX } from "solid-js"
import { Array, pipe } from "effect"

import { Deck } from "@app/model"
import { GameState } from "@app/state"

import PlaceHolderCardView from "../PlaceholderCard"

const DrawPile = (): JSX.Element => {
  const draw = (): Deck.Draw => {
    return pipe(GameState.currentPlayerDeck(), deck => deck.draw)
  }

  const handleOnClickDraw = (): void => {
    GameState.drawCard()
  }

  return (
    <div data-testid="draw-pile">
      <h2 class="section-header">Draw Pile</h2>
      <PlaceHolderCardView>
        <div
          data-testid="draw-pile-count"
          class="w-full h-full flex justify-center items-center"
          onClick={handleOnClickDraw}
        >
          {pipe(draw(), Array.length)}
        </div>
      </PlaceHolderCardView>
    </div>
  )
}

export default DrawPile
