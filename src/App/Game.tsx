import { JSX } from "solid-js"

import Board from "./Board"
import PlayerCards from "./PlayerCards"
import TurnDisplay from "./TurnDisplay"
import GameDisplay from "./GameDisplay"
import Supply from "./Supply"

const GameView = (): JSX.Element => {
  return (
    <div data-testid="game-view" class="flex flex-col p-2 space-y-2">
      <div class="">
        <GameDisplay />
      </div>
      <div class="">
        <Board />
      </div>
      <div>
        <TurnDisplay />
      </div>
      <div class="">
        <PlayerCards />
      </div>
      <div class="">
        <Supply />
      </div>
    </div>
  )
}

export default GameView
