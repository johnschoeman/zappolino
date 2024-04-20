import { JSX } from "solid-js"

import CommitedResourceMat from "./CommitResourceMat"
import DrawAndDiscard from "./DrawAndDiscard"
import HandView from "./Hand"
import PlayMat from "./PlayMat"

const PlayerCards = (): JSX.Element => {
  return (
    <div data-testid="player-cards" class="w-full">
      <div class="flex flex-row w-full">
        <PlayMat />
        <CommitedResourceMat />
      </div>
      <HandView />
      <DrawAndDiscard />
    </div>
  )
}

export default PlayerCards
