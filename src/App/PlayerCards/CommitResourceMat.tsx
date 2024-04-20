import { JSX } from "solid-js"
import { GameState } from "@app/state"
import { Deck, Card, GameAction } from "@app/model"
import { pipe, ReadonlyArray } from "effect"

import CardView from "../Card"

const CommitResourceMat = (): JSX.Element => {
  const playMatStyle = "h-96 p-2 border rounded"

  const resourceCommitedCards = (): Deck.Played => {
    return pipe(GameState.commitedResourceCards())
  }
  const handleOnClickCommitResourceMat = (): void => {
    pipe(
      GameState.game(),
      GameAction.selectCommitResourceMat,
      GameState.setGame,
    )
  }

  return (
    <div
      data-testid="commited-resource-mat"
      class={playMatStyle}
      onClick={handleOnClickCommitResourceMat}
    >
      <h2>Play Mat</h2>

      <div class="space-x-1">
        {pipe(
          resourceCommitedCards(),
          ReadonlyArray.map((card, idx) => {
            return <PlayedCardView card={card} idx={idx} />
          }),
        )}
      </div>
    </div>
  )
}

type PlayedCardViewProps = {
  card: Card.Card
  idx: number
}
const PlayedCardView = (props: PlayedCardViewProps): JSX.Element => {
  const card = props.card
  const idx = props.idx

  const testId = `consumed-card-${idx}`

  return (
    <div data-testid={testId} class="card">
      <CardView card={card} />
    </div>
  )
}

export default CommitResourceMat
