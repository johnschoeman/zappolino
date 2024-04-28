import { JSX } from "solid-js"
import { Array, pipe } from "effect"

import { Card, Deck, GameAction } from "@app/model"
import { GameState } from "@app/state"

import CardView from "../Card"
import PlaceHolderCardView from "../PlaceholderCard"

const PlayMat = (): JSX.Element => {
  const playMatStyle = "p-2"

  const playedCards = (): Deck.Played => {
    return pipe(GameState.playedCards())
  }

  const countPlayed = (): number => {
    return pipe(playedCards(), Array.length)
  }

  const isNoPlayedCard = (): boolean => {
    return pipe(playedCards(), Array.isEmptyArray)
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
      <h2 class="section-header">
        Play Mat <span>{countPlayed()}</span>
      </h2>

      {isNoPlayedCard() && <PlaceHolderCardView />}

      <div>
        {pipe(
          playedCards(),
          Array.take(1),
          Array.map((card, idx) => {
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
      <CardView card={card} testIdPrefix="play-mat" />
    </div>
  )
}

export default PlayMat
