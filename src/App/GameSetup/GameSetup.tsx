import { JSX } from "solid-js"
import { Array, pipe, Record } from "effect"

import { Card, Supply } from "@app/model"
import { GameSetupState, GameState } from "@app/state"

const GameSetupView = (): JSX.Element => {
  const handleOnClickStartGame = (): void => {
    GameState.startGame()
  }

  return (
    <div class="w-full h-full p-8 flex justify-start items-center flex-col">
      <div class="flex">
        <h1 class="text-4xl font-bold">Phalanx</h1>
      </div>

      <div class="flex flex-row w-full justify-between p-4">
        <SupplyPiles />
        <div>
          <StartingHandCards />
          <StartingHandSize />
        </div>
      </div>

      <div class="flex-grow flex justify-center items-center w-full">
        <button
          data-testid="start-game-button"
          class="btn-rectangle btn-green-600"
          onClick={handleOnClickStartGame}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}

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

  return (
    <div class="w-full flex flex-col justify-center items-center">
      <h2>Supply Cards</h2>

      <button onClick={handleOnClickCheckAll}>Check all</button>
      <button
        data-testId="starting-supply-uncheck-all"
        onClick={handleOnClickUncheckAll}
      >
        Uncheck all
      </button>

      <div>
        {pipe(
          cards(),
          Array.map(card => {
            const isEnabled = supplyPiles()[card]
            return <SupplyPile value={isEnabled} card={card} />
          }),
        )}
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
    <div class="space-x-2">
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

const StartingHandCards = (): JSX.Element => {
  const gameSetup = GameSetupState.gameSetup()
  const handCount = gameSetup.handCount
  const cards = pipe(handCount, Record.keys)

  return (
    <div class="w-full flex flex-col justify-center items-center">
      <h2>Start Hand Cards</h2>

      <div>
        {pipe(
          cards,
          Array.map(card => {
            const count = handCount[card]
            return <HandCardInput value={count} card={card} />
          }),
        )}
      </div>
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
    <div class="space-x-2">
      <label for={testId} class="">
        {labelText}
      </label>
      <input
        data-testid={testId}
        type="number"
        onChange={handleOnChangeValue}
        name={nameText}
        id={testId}
        class=""
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
    <div class="space-x-2">
      <label for={testId} class="">
        Starting Hand Size
      </label>
      <input
        data-testid={testId}
        type="number"
        onChange={handleOnChangeValue}
        name={nameText}
        id={testId}
        class=""
        value={value}
        min="1"
        max="10"
      />
    </div>
  )
}

export default GameSetupView
