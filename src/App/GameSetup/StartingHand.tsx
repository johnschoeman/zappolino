import { JSX } from "solid-js"
import { Array, pipe, Record } from "effect"

import { Card } from "@app/model"
import { GameSetupState } from "@app/state"

const StartingHand = (): JSX.Element => {
  return (
    <div class="w-full flex justify-center items-center">
      <div class="w-full flex max-w-96 flex-col items-center">
        <h2 class="section-header">Start Hand Cards</h2>
        <StartingHandSize />

        <div class="mt-4 mb-4 px-4 w-full border border-gray-400" />
        <div class="w-full flex flex-row justify-center space-x-2">
          <StartingHandCardsTactic />
          <StartingHandCardsStrategy />
        </div>
      </div>
    </div>
  )
}

const StartingHandSize = (): JSX.Element => {
  const gameSetup = GameSetupState.gameSetup()
  const value = gameSetup.startingHandSize

  const handleOnChangeValue: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const nextValue = e.currentTarget.value
    GameSetupState.setHandSize(Number(nextValue))
  }

  const testId = "starting-hand-size"
  const nameText = testId

  return (
    <div class="w-full flex flex-row justify-between">
      <label for={testId} class="">
        Starting Hand Size
      </label>
      <input
        data-testid={testId}
        type="number"
        onChange={handleOnChangeValue}
        name={nameText}
        id={testId}
        class="border w-12 py-1 text-center rounded border-gray-400"
        value={value}
        min="1"
        max="10"
      />
    </div>
  )
}

const StartingHandCardsTactic = (): JSX.Element => {
  const gameSetup = GameSetupState.gameSetup()
  const handCount = gameSetup.handSetupTactic
  const cards = pipe(handCount, Record.keys)

  return (
    <div>
      <h2 class="section-header">Tactic Cards</h2>
      <div class="w-full flex flex-col space-y-1">
        {pipe(
          cards,
          Array.map(card => {
            const count = handCount[card]
            return <HandCardInputTactic value={count} card={card} />
          }),
        )}
      </div>
    </div>
  )
}

type HandCardInputTacticProps = {
  card: Card.TacticCard
  value: number
}
const HandCardInputTactic = (props: HandCardInputTacticProps): JSX.Element => {
  const card = props.card
  const value = props.value

  const labelText = Card.toTitle(card)
  const nameText = Card.show(card)
  const testId = `starting-hand-${Card.show(card)}`

  const handleOnChangeValue: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const nextValue = e.currentTarget.value
    const gameSetup = GameSetupState.gameSetup()
    const handCount = gameSetup.handSetupTactic
    const nextHandCount = { ...handCount }
    nextHandCount[card] = Number(nextValue)
    GameSetupState.setHandSetupTactic(nextHandCount)
  }

  return (
    <div class="w-full flex flex-row justify-between">
      <label for={testId} class="">
        {labelText}
      </label>
      <input
        data-testid={testId}
        type="number"
        onChange={handleOnChangeValue}
        name={nameText}
        id={testId}
        class="border w-12 py-1 text-center rounded border-gray-400"
        value={value}
        min="0"
        max="3"
      />
    </div>
  )
}

const StartingHandCardsStrategy = (): JSX.Element => {
  const gameSetup = GameSetupState.gameSetup()
  const handCount = gameSetup.handSetupStrategy
  const cards = pipe(handCount, Record.keys)

  return (
    <div>
      <h2 class="section-header">Strategy Cards</h2>
      <div class="w-full flex flex-col space-y-1">
        {pipe(
          cards,
          Array.map(card => {
            const count = handCount[card]
            return <HandCardInputStrategy value={count} card={card} />
          }),
        )}
      </div>
    </div>
  )
}

type HandCardInputStrategyProps = {
  card: Card.StrategyCard
  value: number
}
const HandCardInputStrategy = (
  props: HandCardInputStrategyProps,
): JSX.Element => {
  const card = props.card
  const value = props.value

  const labelText = Card.toTitle(card)
  const nameText = Card.show(card)
  const testId = `starting-hand-${Card.show(card)}`

  const handleOnChangeValue: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const nextValue = e.currentTarget.value
    const gameSetup = GameSetupState.gameSetup()
    const handCount = gameSetup.handSetupStrategy
    const nextHandCount = { ...handCount }
    nextHandCount[card] = Number(nextValue)
    GameSetupState.setHandSetupStrategy(nextHandCount)
  }

  return (
    <div class="w-full flex flex-row justify-between">
      <label for={testId} class="">
        {labelText}
      </label>
      <input
        data-testid={testId}
        type="number"
        onChange={handleOnChangeValue}
        name={nameText}
        id={testId}
        class="border w-12 py-1 text-center rounded border-gray-400"
        value={value}
        min="0"
        max="3"
      />
    </div>
  )
}

export default StartingHand
