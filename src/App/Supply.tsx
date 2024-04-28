import { JSX } from "solid-js"
import { Array, pipe } from "effect"

import { Supply } from "@app/model"
import { GameState } from "@app/state"

import CardView from "./Card"

const handleOnClickSupplyPile = (pileIdx: number) => (): void => {
  GameState.selectSupplyPile(pileIdx)
}

const SupplyView = (): JSX.Element => {
  return (
    <div class="p-2">
      <h1 class="section-header">Supply</h1>
      <div class="w-screen h-full flex flex-wrap space-x-2">
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
      <CardView card={card} testIdPrefix="supply-pile-card" />

      <div data-testid={`${testId}-count`} class="w-full text-center">
        {supplyPile.count}
      </div>
    </div>
  )
}

export default SupplyView
