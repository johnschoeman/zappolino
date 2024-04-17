import { JSX } from "solid-js"
import cn from "classnames"
import { Option, pipe, ReadonlyArray } from "effect"

import { Card, Deck, GameAction } from "@app/model"
import { GameState } from "@app/state"

import CardView from "./Card"

const PlayerCards = (): JSX.Element => {
  const playedCards = (): Deck.Played => {
    return pipe(GameState.currentPlayerDeck(), deck => deck.playedCards)
  }

  const hand = (): Deck.Hand => {
    return pipe(GameState.currentPlayerDeck(), deck => deck.hand)
  }

  const disc = (): Deck.Disc => {
    return pipe(GameState.currentPlayerDeck(), deck => deck.disc)
  }

  const draw = (): Deck.Draw => {
    return pipe(GameState.currentPlayerDeck(), deck => deck.draw)
  }

  const handleOnClickPlayMat = (): void => {
    pipe(GameState.game(), GameAction.selectPlayMat, GameState.setGame)
  }

  const playMatStyle = "h-96 p-2 border rounded"
  const handStyle = "h-96 p-2 border rounded"
  const discardStyle = "h-96 p-2 border rounded flex flex-row space-x-2"
  const cardStyle =
    "w-48 h-64 border rounded border-black bg-gray-200 justify-center items-center text-center"

  return (
    <div data-testid="player-cards" class="flex flex-col space-y-2">
      <div
        data-testid="player-playmat"
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

      <div data-testid="player-hand-list" class={handStyle}>
        <h2>Hand</h2>
        <div class="flex flex-row space-x-2 overflow-x-auto pr-16">
          {pipe(
            hand(),
            ReadonlyArray.map((card, idx) => {
              return <CardContainer card={card} idx={idx} />
            }),
          )}
        </div>
      </div>

      <div class={discardStyle}>
        <div data-testid="discard-pile">
          <h2>Draw Pile</h2>
          <div data-testid="draw-pile-count" class={cardStyle}>
            {pipe(draw(), ReadonlyArray.length)}
          </div>
        </div>

        <div data-testid="discard-pile">
          <h2>Discard Pile</h2>
          <div data-testid="discard-pile-count" class={cardStyle}>
            {pipe(disc(), ReadonlyArray.length)}
          </div>
        </div>
      </div>
    </div>
  )
}

type CardContainerProps = {
  card: Card.Card
  idx: number
}
const CardContainer = (props: CardContainerProps): JSX.Element => {
  const card = props.card
  const idx = props.idx

  const selectedCardIdx = (): Option.Option<number> => {
    return pipe(GameState.game(), game => game.selectedCardIdx)
  }

  const isSelected = (): boolean => {
    return pipe(
      selectedCardIdx(),
      Option.map(cardIdx => cardIdx === idx),
      Option.getOrElse(() => false),
    )
  }

  const testId = `unplayed-card-${idx}`

  const handleOnClickCard = (): void => {
    pipe(GameState.game(), GameAction.selectHandCard(idx), GameState.setGame)
  }

  const style = cn({ selected: isSelected() })

  return (
    <button data-testid={testId} onClick={handleOnClickCard} class={style}>
      <CardView card={card} />

      {isSelected() && (
        <div class="h-8 flex justify-center items-center">
          <div class="w-4 h-4 rounded-full bg-gray-900"></div>
        </div>
      )}
    </button>
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

export default PlayerCards
