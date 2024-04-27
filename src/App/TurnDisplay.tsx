import { JSX } from "solid-js"
import cn from "classnames"
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
  const placementCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.placementPoints)
  }
  const strategyCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.strategyPoints)
  }
  const tacticCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.tacticPoints)
  }
  const resourceCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.resourcePoints)
  }

  const containerStyle = "flex flex-row items-center space-x-2 p-2"
  const basePointStyle =
    "font-bold border rounded flex justify-center items-center w-12 h-12"

  const placementCountStyle = cn(basePointStyle, "bg-blue-400")
  const strategyCountStyle = cn(basePointStyle, "bg-purple-400")
  const tacticCountStyle = cn(basePointStyle, "bg-red-400")
  const resourceCountStyle = cn(basePointStyle, "bg-yellow-400")

  return (
    <div class="w-full">
      <h2 class="text-sm font-bold">Turn Points</h2>

      <div class="w-full flex flex-row items-center space-x-4">
        <div class={containerStyle}>
          <span>Hoplite:</span>
          <span class={placementCountStyle} data-testid="placement-count">
            {placementCount()}
          </span>
        </div>

        <div class={containerStyle}>
          <span>Strategy:</span>
          <span class={strategyCountStyle} data-testid="strategy-count">
            {strategyCount()}
          </span>
        </div>

        <div class={containerStyle}>
          <span>Tactic:</span>
          <span class={tacticCountStyle} data-testid="tactic-count">
            {tacticCount()}
          </span>
        </div>

        <div class={containerStyle}>
          <span>Resources:</span>
          <span class={resourceCountStyle} data-testid="resource-count">
            {resourceCount()}
          </span>
        </div>
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
