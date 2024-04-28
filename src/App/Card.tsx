import { JSX } from "solid-js"
import cn from "classnames"

import { Card } from "@app/model"

type CardViewProps = {
  card: Card.Card
  testIdPrefix: string
}
const CardView = (props: CardViewProps): JSX.Element => {
  const card = props.card
  const testIdPrefix = props.testIdPrefix

  const title = Card.toTitle(card)
  const kind = Card.toKind(card)
  const description = Card.toDescription(card)

  const acquireCost = Card.toResourceCost(card)
  const resourceGain = Card.toResourceValue(card)
  const [hopliteValue, strategyValue, tacticValue, resourceValue, drawValue] =
    Card.toPlayValue(card)

  const showHopliteValue = hopliteValue > 0
  const showDrawValue = drawValue > 0
  const showStrategyValue = strategyValue > 0
  const showTacticValue = tacticValue > 0
  const showResourceValue = resourceValue > 0

  const style =
    "flex flex-col justify-between w-48 h-64 border rounded border-black bg-gray-200 dark:bg-gray-200"

  const headerStyle = cn("font-bold text-center border-b border-black p-4", {
    "bg-red-400": kind === "Tactic",
    "bg-purple-400": kind === "Strategy",
  })

  const testId = `${testIdPrefix}-${Card.show(card)}`

  return (
    <div class={style} data-testId={testId}>
      <div class="divide-y">
        <div class={headerStyle}>{title}</div>
        <div class="text-center p-2">{kind}</div>
      </div>

      <div class="p-4 w-full">
        <div class="text-center">{description}</div>

        <div class="w-full flex flex-col text-center">
          <div>{showHopliteValue && <div>+ {hopliteValue} Hoplite</div>}</div>
          <div>{showDrawValue && <div>+ {drawValue} Draw</div>}</div>
          <div>
            {showStrategyValue && <div>+ {strategyValue} Strategy</div>}
          </div>
          <div>{showTacticValue && <div>+ {tacticValue} Tactics</div>}</div>
          <div>
            {showResourceValue && <div>+ {resourceValue} Resources</div>}
          </div>
        </div>
      </div>

      <div class="p-4 w-full flex flex-row justify-between">
        <div>Cost: {acquireCost}</div>
        <div>Resource: {resourceGain}</div>
      </div>
    </div>
  )
}

export default CardView
