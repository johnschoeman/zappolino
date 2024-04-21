import { JSX } from "solid-js"
import { Array, pipe } from "effect"

import { GameAction, Supply } from "@app/model"
import { GameState } from "@app/state"

import CardView from "./Card"

const handleOnClickSupplyPile = (pileIdx: number) => (): void => {
  pipe(
    GameState.game(),
    GameAction.selectSupplyPile(pileIdx),
    GameState.setGame,
  )
}

const SupplyView = (): JSX.Element => {
  return (
    <div class="border rounded p-2">
      <h1>Supply</h1>
      <div class="w-full h-full grid grid-cols-3 gap-2">
        {pipe(
          GameState.game().supply,
          Array.map((supplyPile, idx) => {
            return <SupplyPile supplyPile={supplyPile} idx={idx} />
          }),
        )}
      </div>
    </div>
  )
}

type SupplyPileProps = {
  supplyPile: Supply.SupplyPile
  idx: number
}
const SupplyPile = ({ supplyPile, idx }: SupplyPileProps): JSX.Element => {
  const testId = `supply-pile-${idx}`
  const card = supplyPile.card

  return (
    <div
      data-testid={testId}
      onClick={handleOnClickSupplyPile(idx)}
      class="border w-48 flex flex-col items-center"
    >
      <CardView card={card} />

      <div data-testid={`${testId}-count`} class="w-full text-center">
        {supplyPile.count}
      </div>
    </div>
  )
}

export default SupplyView
