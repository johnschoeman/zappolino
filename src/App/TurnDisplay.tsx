import { JSX } from "solid-js"
import { pipe } from "effect"

import { GameAction } from "@app/model"
import { GameState } from "@app/state"

const TurnDisplay = (): JSX.Element => {
  return (
    <div class="w-full border rounded p-2 flex flex-row justify-between">
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
  const resourceCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.resourcePoints)
  }

  return (
    <div class="flex flex-row justify-around items-center">
      <div>
        Strategy Points:
        <span data-testid="strategy-count">{strategyCount()}</span>
      </div>

      <div>
        Tactic Points: <span data-testid="tactic-count">{tacticCount()}</span>
      </div>

      <div>
        Resources: <span data-testid="resource-count">{resourceCount()}</span>
      </div>
    </div>
  )
}

const EndTurnButton = (): JSX.Element => {
  const handleOnClickEndTurn = (): void => {
    pipe(GameState.game(), GameAction.endTurn, GameState.setGame)
  }

  return (
    <button
      data-testid="end-turn-button"
      class="px-4 py-2 bg-green-300 rounded w-64"
      onClick={handleOnClickEndTurn}
    >
      End Turn
    </button>
  )
}

export default TurnDisplay
