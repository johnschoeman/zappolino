import { JSX } from "solid-js"
import cn from "classnames"
import { Array, Option, pipe } from "effect"

import { Card, Deck, GameAction } from "@app/model"
import { GameState } from "@app/state"

import CardView from "../Card"

const HandView = (): JSX.Element => {
  const hand = (): Deck.Hand => {
    return pipe(GameState.currentPlayerDeck(), deck => deck.hand)
  }

  const handStyle = "p-2 border rounded"
  return (
    <div data-testid="player-hand-list" class={handStyle}>
      <h2>Hand</h2>
      <div class="flex flex-row space-x-2 overflow-x-auto pr-16">
        {pipe(
          hand(),
          Array.map((card, idx) => {
            return <CardContainer card={card} idx={idx} />
          }),
        )}
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

export default HandView
