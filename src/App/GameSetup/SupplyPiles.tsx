import { JSX } from "solid-js"
import { Array, pipe, Record } from "effect"

import { Card, Supply } from "@app/model"
import { GameSetupState } from "@app/state"

const SupplyPiles = (): JSX.Element => {
  const supplyPiles = (): Supply.CheckedSupplyPiles =>
    GameSetupState.gameSetup().supplyPiles
  const cards = (): Card.Card[] => {
    return pipe(supplyPiles(), Record.keys)
  }

  const handleOnClickCheckAll = (): void => {
    GameSetupState.checkAllSupplyPiles()
  }
  const handleOnClickUncheckAll = (): void => {
    GameSetupState.uncheckAllSupplyPiles()
  }
  const handleOnClickRandomize = (): void => {
    GameSetupState.randomizeSupplyPiles()
  }

  const buttonStyle = "btn-base btn-green-600 btn-small"

  return (
    <div class="w-full flex justify-center items-center">
      <div class="w-full h-full max-w-96 flex flex-col space-y-2 items-center">
        <h2 class="section-header">Supply Cards</h2>

        <div class="flex flex-row space-x-2">
          <button class={buttonStyle} onClick={handleOnClickCheckAll}>
            Check all
          </button>
          <button
            class={buttonStyle}
            data-testId="starting-supply-uncheck-all"
            onClick={handleOnClickUncheckAll}
          >
            Uncheck all
          </button>
          <button class={buttonStyle} onClick={handleOnClickRandomize}>
            Randomize
          </button>
        </div>

        <div class="w-full max-w-64 flex flex-col space-y-1">
          {pipe(
            cards(),
            Array.map(card => {
              const isEnabled = supplyPiles()[card]
              return <SupplyPile value={isEnabled} card={card} />
            }),
          )}
        </div>
      </div>
    </div>
  )
}

type SupplyPileProps = {
  card: Card.Card
  value: boolean
}
const SupplyPile = (props: SupplyPileProps): JSX.Element => {
  const card = props.card
  const value = props.value

  const labelText = Card.toTitle(card)
  const nameText = Card.show(card)
  const testId = `starting-supply-pile-${Card.show(card)}`

  const handleOnChangeValue: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const nextValue = e.currentTarget.checked
    const gameSetup = GameSetupState.gameSetup()
    const supplyPiles = gameSetup.supplyPiles
    const nextSupplyPiles = { ...supplyPiles }
    nextSupplyPiles[card] = nextValue
    GameSetupState.setSupplyPiles(nextSupplyPiles)
  }

  return (
    <div class="w-full flex flex-row justify-between">
      <label for={testId} class="">
        {labelText}
      </label>
      <input
        data-testid={testId}
        type="checkbox"
        onChange={handleOnChangeValue}
        name={nameText}
        id={testId}
        class=""
        checked={value}
      />
    </div>
  )
}

export default SupplyPiles
