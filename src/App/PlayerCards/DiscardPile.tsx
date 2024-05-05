import { JSX } from "solid-js"
import { Array, pipe } from "effect"

import { Deck } from "@app/model"
import { GameState } from "@app/state"

import PlaceHolderCardView from "../PlaceholderCard"

const DiscardPile = (): JSX.Element => {
  const disc = (): Deck.Disc => {
    return pipe(GameState.currentPlayerDeck(), deck => deck.disc)
  }

  return (
    <div data-testid="discard-pile">
      <h2 class="section-header">Discard Pile</h2>
      <PlaceHolderCardView>
        <div
          data-testid="discard-pile-count"
          class="w-full h-full flex justify-center items-center"
        >
          {pipe(disc(), Array.length)}
        </div>
      </PlaceHolderCardView>
    </div>
  )
}

export default DiscardPile
