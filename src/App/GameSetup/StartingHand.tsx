import { JSX } from "solid-js"
import { Array, pipe, Record } from "effect"

import { Card } from "@app/model"
import { GameSetupState } from "@app/state"

const StartingHand = (): JSX.Element => {
  return (
    <div class="w-full flex justify-center items-center">
      <div class="w-full max-w-64 flex flex-col items-center">
        <h2 class="section-header">Start Hand Cards</h2>
        <StartingHandSize />
        <div class="mt-4 mb-4 px-4 w-full border border-gray-400" />
        <StartingHandCards />
      </div>
    </div>
  )
}

const StartingHandCards = (): JSX.Element => {
  const gameSetup = GameSetupState.gameSetup()
  const handCount = gameSetup.handCount
  const cards = pipe(handCount, Record.keys)

  return (
    <div class="w-full flex flex-col space-y-1">
      {pipe(
        cards,
        Array.map(card => {
          const count = handCount[card]
          return <HandCardInput value={count} card={card} />
        }),
      )}
    </div>
  )
}

type HandCardInputProps = {
  card: Card.Card
  value: number
}
const HandCardInput = (props: HandCardInputProps): JSX.Element => {
  const card = props.card
  const value = props.value

  const labelText = Card.toTitle(card)
  const nameText = Card.show(card)
  const testId = `starting-hand-${Card.show(card)}`

  const handleOnChangeValue: JSX.EventHandler<HTMLInputElement, Event> = e => {
    const nextValue = e.currentTarget.value
    const gameSetup = GameSetupState.gameSetup()
    const handCount = gameSetup.handCount
    const nextHandCount = { ...handCount }
    nextHandCount[card] = Number(nextValue)
    GameSetupState.setHandCount(nextHandCount)
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

export default StartingHand
