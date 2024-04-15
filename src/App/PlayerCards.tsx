import { JSX } from "solid-js"
import cn from "classnames"
import { Option, pipe, ReadonlyArray } from "effect"

import { Card, Deck, GameAction } from "@app/model"
import { GameState } from "@app/state"

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

  const playMatStyle = "h-48 p-2 border rounded"
  const handStyle = "h-48 p-2 border rounded"
  const discardStyle = "h-48 p-2 border rounded flex flex-row space-x-2"

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
              return <CardView card={card} idx={idx} />
            }),
          )}
        </div>
      </div>

      <div class={discardStyle}>
        <div data-testid="discard-pile">
          <h2>Draw Pile</h2>
          <div data-testid="draw-pile-count" class="card">
            {pipe(draw(), ReadonlyArray.length)}
          </div>
        </div>

        <div data-testid="discard-pile">
          <h2>Discard Pile</h2>
          <div data-testid="discard-pile-count" class="card">
            {pipe(disc(), ReadonlyArray.length)}
          </div>
        </div>
      </div>
    </div>
  )
}

type CardViewProps = {
  card: Card.Card
  idx: number
}
const CardView = (props: CardViewProps): JSX.Element => {
  const card = props.card
  const idx = props.idx
  const title = Card.toTitle(card)

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

  const style = (): string => {
    return cn("btn-card btn-gray-200 card w-48", {
      "selected border-green-400": isSelected(),
    })
  }

  return (
    <button data-testid={testId} class={style()} onClick={handleOnClickCard}>
      <div>
        <h1>{title}</h1>
      </div>
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
  const title = Card.toTitle(card)

  const testId = `played-card-${idx}`

  return (
    <div data-testid={testId} class="card">
      {title}
    </div>
  )
}

export default PlayerCards
