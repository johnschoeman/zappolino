import { JSX } from "solid-js"
import { pipe, ReadonlyArray } from "effect"

import { Card, Deck, GameAction } from "@app/model"
import { GameState } from "@app/state"

import CardView from "../Card"
import PlaceHolderCardView from "../PlaceholderCard"

const PlayMat = (): JSX.Element => {
  const playMatStyle = "p-2 border rounded"

  const playedCards = (): Deck.Played => {
    return pipe(GameState.playedCards())
  }

  const countPlayed = (): number => {
    return pipe(playedCards(), ReadonlyArray.length)
  }

  const isNoPlayedCard = (): boolean => {
    return pipe(playedCards(), ReadonlyArray.isEmptyArray)
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
      <h2>
        Play Mat <span>{countPlayed()}</span>
      </h2>

      {isNoPlayedCard() && <PlaceHolderCardView />}

      <div>
        {pipe(
          playedCards(),
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

  const testId = `consumed-card-${idx}`

  return (
    <div data-testid={testId} class="card">
      <CardView card={card} />
    </div>
  )
}

export default PlayMat