import { JSX } from "solid-js"
import { Array, pipe, Record } from "effect"

import { Card } from "@app/model"
import * as SupplySetup from "@app/model/gameSetup/supplySetup"
import { GameSetupState } from "@app/state"

const SupplyPiles = (): JSX.Element => {
  return (
    <div>
      <h2 class="section-header">Supply Cards</h2>
      <div class="flex flex-row space-x-2">
        <TacticSupplyPiles />
        <StrategySupplyPiles />
      </div>
    </div>
  )
}

const TacticSupplyPiles = (): JSX.Element => {
  const supplySetupTactic = (): SupplySetup.SupplySetupTactic =>
    GameSetupState.gameSetup().supplySetupTactic
  const cards = (): Card.TacticCard[] => {
    return pipe(supplySetupTactic(), Record.keys, Array.filter(Card.isTactic))
  }

  const handleOnClickCheckAll = (): void => {
    GameSetupState.checkAllTacticSupplyPiles()
  }
  const handleOnClickUncheckAll = (): void => {
    GameSetupState.uncheckAllTacticSupplyPiles()
  }
  const handleOnClickRandomize = (): void => {
    GameSetupState.randomizeTacticSupplyPiles()
  }

  const buttonStyle = "btn-base btn-green-600 btn-small"

  return (
    <div class="w-full flex justify-center items-center">
      <div class="w-full h-full max-w-96 flex flex-col space-y-2 items-center">
        <h2 class="section-header">Tactic Cards</h2>

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
              const isEnabled = supplySetupTactic()[card]
              return <SupplyPileTactic value={isEnabled} card={card} />
            }),
          )}
        </div>
      </div>
    </div>
  )
}

const StrategySupplyPiles = (): JSX.Element => {
  const supplySetupStrategy = (): SupplySetup.SupplySetupStrategy =>
    GameSetupState.gameSetup().supplySetupStrategy
  const cards = (): Card.StrategyCard[] => {
    return pipe(
      supplySetupStrategy(),
      Record.keys,
      Array.filter(Card.isStrategy),
    )
  }

  const handleOnClickCheckAll = (): void => {
    GameSetupState.checkAllStrategySupplyPiles()
  }
  const handleOnClickUncheckAll = (): void => {
    GameSetupState.uncheckAllStrategySupplyPiles()
  }
  const handleOnClickRandomize = (): void => {
    GameSetupState.randomizeStrategySupplyPiles()
  }

  const buttonStyle = "btn-base btn-green-600 btn-small"

  return (
    <div class="w-full flex justify-center items-center">
      <div class="w-full h-full max-w-96 flex flex-col space-y-2 items-center">
        <h2 class="section-header">Strategy Cards</h2>

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
              const isEnabled = supplySetupStrategy()[card]
              return <SupplyPileStrategy value={isEnabled} card={card} />
            }),
          )}
        </div>
      </div>
    </div>
  )
}

type SupplyPileTacticProps = {
  card: Card.TacticCard
  value: boolean
}
const SupplyPileTactic = (props: SupplyPileTacticProps): JSX.Element => {
  const card = props.card
  const value = props.value

  const labelText = Card.toTitle(card)
  const nameText = Card.show(card)
  const testId = `starting-supply-pile-${Card.show(card)}`

  const handleOnChangeValue: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const nextValue = e.currentTarget.checked
    const gameSetup = GameSetupState.gameSetup()
    const supplyPiles = gameSetup.supplySetupTactic
    const nextSupplyPiles = { ...supplyPiles }
    nextSupplyPiles[card] = nextValue
    GameSetupState.setSupplySetupTactic(nextSupplyPiles)
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

type SupplyPileStrategyProps = {
  card: Card.StrategyCard
  value: boolean
}
const SupplyPileStrategy = (props: SupplyPileStrategyProps): JSX.Element => {
  const card = props.card
  const value = props.value

  const labelText = Card.toTitle(card)
  const nameText = Card.show(card)
  const testId = `starting-supply-pile-${Card.show(card)}`

  const handleOnChangeValue: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const nextValue = e.currentTarget.checked
    const gameSetup = GameSetupState.gameSetup()
    const supplyPiles = gameSetup.supplySetupStrategy
    const nextSupplyPiles = { ...supplyPiles }
    nextSupplyPiles[card] = nextValue
    GameSetupState.setSupplySetupStrategy(nextSupplyPiles)
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
