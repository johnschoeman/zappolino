import { JSX } from "solid-js"
import { pipe } from "effect"

import { Game } from "@app/model"
import { GameState } from "@app/state"

const TurnDisplay = (): JSX.Element => {
  return (
    <div class="w-full border rounded flex flex-row justify-between p-2">
      <StrategyAndTacticCounts />
      <EndTurnButton />
    </div>
  )
}

const StrategyAndTacticCounts = (): JSX.Element => {
  const strategyCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.strategyPoints)
  }
  const tacticCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.tacticPoints)
  }

  return (
    <div>
      <h1 data-testid="current-player">{GameState.game().currentPlayer}</h1>

      <h1>
        Strategy Points:
        <span data-testid="strategy-count">{strategyCount()}</span>
      </h1>

      <h1>
        Tactic Points:
        <span data-testid="tactic-count">{tacticCount()}</span>
      </h1>
    </div>
  )
}

const EndTurnButton = (): JSX.Element => {
  const handleOnClickEndTurn = (): void => {
    pipe(GameState.game(), Game.endTurn, GameState.setGame)
  }

  return (
    <button
      data-testid="end-turn-button"
      class="px-4 py-2 bg-green-300 rounded"
      onClick={handleOnClickEndTurn}
    >
      End Turn
    </button>
  )
}

export default TurnDisplay