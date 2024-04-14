import { JSX } from "solid-js"

import { GameState } from "@app/state"
import { pipe, ReadonlyArray } from "effect"
import { Card, Game, Supply } from "@app/model"

const handleOnClickSupplyPile = (pileIdx: number) => (): void => {
  pipe(GameState.game(), Game.selectSupplyPile(pileIdx), GameState.setGame)
}

const SupplyView = (): JSX.Element => {
  return (
    <div class="border rounded p-2">
      <h1>Supply</h1>
      <div class="w-full h-full grid grid-cols-3 gap-2">
        {pipe(
          GameState.game().supply,
          ReadonlyArray.map((supplyPile, idx) => {
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
  const title = Card.toTitle(supplyPile.card)
  const style = "btn-card btn-gray-200 flex flex-col"

  return (
    <div
      data-testid={testId}
      onClick={handleOnClickSupplyPile(idx)}
      class={style}
    >
      <div data-testid={`${testId}-count`} class="w-full text-right">
        {supplyPile.count}
      </div>
      <div>{title}</div>
    </div>
  )
}

export default SupplyView
