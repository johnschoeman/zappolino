import { JSX } from "solid-js"

import { GameStartedState } from "@app/state"

import Board from "./Board"
import GameDisplay from "./GameDisplay"
import PlayerCards from "./PlayerCards"
import Supply from "./Supply"
import TurnDisplay from "./TurnDisplay"

const GameView = (): JSX.Element => {
  const handleOnClickEndGame = (): void => {
    GameStartedState.setGameStarted(false)
  }

  return (
    <div data-testid="game-view" class="h-full flex flex-col p-2 space-y-2">
      <div class="flex flex-row justify-between">
        <h1 class="font-bold text-lg uppercase">Phalanx</h1>
        <button
          data-testId="end-game-button"
          onClick={handleOnClickEndGame}
          class="btn-base rounded bg-gray-200 p-2"
        >
          End Game
        </button>
      </div>

      <div class="">
        <GameDisplay />
      </div>

      <div class="flex flex-row">
        <div>
          <Board />
        </div>
        <div class="flex flex-col">
          <TurnDisplay />
          <PlayerCards />
        </div>
      </div>

      <div class="">
        <Supply />
      </div>
    </div>
  )
}

export default GameView
