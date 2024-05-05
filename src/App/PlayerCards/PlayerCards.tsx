import { JSX } from "solid-js"

import CommitedResourceMat from "./CommitResourceMat"
import DiscardPile from "./DiscardPile"
import DrawPile from "./DrawPile"
import HandView from "./Hand"
import PlayMat from "./PlayMat"

const PlayerCards = (): JSX.Element => {
  return (
    <div data-testid="player-cards" class="w-full">
      <div class="flex flex-row w-full justify-between">
        <div class="flex flex-row space-x-2">
          <PlayMat />
          <CommitedResourceMat />
        </div>
        <div class="flex flex-row space-x-2">
          <DrawPile />
          <DiscardPile />
        </div>
      </div>
      <HandView />
    </div>
  )
}

export default PlayerCards
