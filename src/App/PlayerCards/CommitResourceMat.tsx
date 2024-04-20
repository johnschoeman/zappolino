import { JSX } from "solid-js"
import { pipe, ReadonlyArray } from "effect"

import { Card, Deck, GameAction } from "@app/model"
import { GameState } from "@app/state"

import CardView from "../Card"
import PlaceHolderCardView from "../PlaceholderCard"

const CommitResourceMat = (): JSX.Element => {
  const commitResourceMatStyle = "p-2 border rounded"

  const resourceCommitedCards = (): Deck.Played => {
    return pipe(GameState.commitedResourceCards())
  }

  const countCommited = (): number => {
    return pipe(resourceCommitedCards(), ReadonlyArray.length)
  }

  const isNoCommittedCards = (): boolean => {
    return pipe(resourceCommitedCards(), ReadonlyArray.isEmptyArray)
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
      data-testid="commit-resource-mat"
      class={commitResourceMatStyle}
      onClick={handleOnClickCommitResourceMat}
    >
      <h2>
        Commit Resource Mat <span>{countCommited()}</span>
      </h2>

      {isNoCommittedCards() && <PlaceHolderCardView />}

      <div class="space-x-1">
        {pipe(
          resourceCommitedCards(),
          ReadonlyArray.take(1),
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

  const testId = `committed-card-${idx}`

  return (
    <div data-testid={testId} class="card">
      <CardView card={card} />
    </div>
  )
}

export default CommitResourceMat
