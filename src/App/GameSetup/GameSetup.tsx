import { JSX } from "solid-js"

import { GameState } from "@app/state"

import StartingHand from "./StartingHand"
import SupplyPiles from "./SupplyPiles"

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

        <StartingHand />
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

export default GameSetupView
