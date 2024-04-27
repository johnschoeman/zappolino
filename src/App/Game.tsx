import { JSX } from "solid-js"

import Board from "./Board"
import GameDisplay from "./GameDisplay"
import PlayerCards from "./PlayerCards"
import Supply from "./Supply"
import TurnDisplay from "./TurnDisplay"

const GameView = (): JSX.Element => {
  return (
    <div data-testid="game-view" class="h-full flex flex-col p-2 space-y-2">
      <h1 class="font-bold text-lg uppercase">Phalanx</h1>
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
