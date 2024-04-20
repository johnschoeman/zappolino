import { JSX } from "solid-js"
import { GameState } from "@app/state"
import { Deck, Card, GameAction } from "@app/model"
import { pipe, ReadonlyArray } from "effect"

import CardView from "../Card"

const PlayMat = (): JSX.Element => {
  const playMatStyle = "h-96 p-2 border rounded"

  const playedCards = (): Deck.Played => {
    return pipe(GameState.playedCards())
  }

  const handleOnClickPlayMat = (): void => {
    pipe(GameState.game(), GameAction.selectPlayMat, GameState.setGame)
  }

  return (
    <div
      data-testid="play-mat"
      class={playMatStyle}
      onClick={handleOnClickPlayMat}
    >
      <h2>Play Mat</h2>
      <div class="space-x-1">
        {pipe(
          playedCards(),
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

export default PlayMat
