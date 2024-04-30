import { JSX } from "solid-js"
import cn from "classnames"
import { pipe } from "effect"

import { GameState } from "@app/state"

const TurnDisplay = (): JSX.Element => {
  return (
    <div class="w-full rounded p-2 flex flex-row justify-between">
      <StrategyAndTacticCounts />
      <EndTurnButton />
    </div>
  )
}

const StrategyAndTacticCounts = (): JSX.Element => {
  const hoplCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.hoplPts)
  }
  const straCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.strtPts)
  }
  const tactCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.tactPts)
  }
  const resoCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.rescPts)
  }
  const drawCount = (): number => {
    return pipe(GameState.game(), game => game.turnPoints.drawPts)
  }

  const containerStyle = "flex flex-row items-center space-x-2 p-2"
  const basePointStyle = "point-display"

  const placCountStyle = cn(basePointStyle, "hoplite")
  const straCountStyle = cn(basePointStyle, "strategy")
  const tactCountStyle = cn(basePointStyle, "tactic")
  const resoCountStyle = cn(basePointStyle, "resource")
  const drawCountStyle = cn(basePointStyle, "draw")

  return (
    <div class="w-full">
      <h2 class="section-header">Turn Points</h2>

      <div class="w-full flex flex-row items-center space-x-4">
        <div class={containerStyle}>
          <span>Hoplite:</span>
          <span class={placCountStyle} data-testid="hopl-pts-count">
            {hoplCount()}
          </span>
        </div>

        <div class={containerStyle}>
          <span>Strategy:</span>
          <span class={straCountStyle} data-testid="strt-pts-count">
            {straCount()}
          </span>
        </div>

        <div class={containerStyle}>
          <span>Tactic:</span>
          <span class={tactCountStyle} data-testid="tact-pts-count">
            {tactCount()}
          </span>
        </div>

        <div class={containerStyle}>
          <span>Resources:</span>
          <span class={resoCountStyle} data-testid="resc-pts-count">
            {resoCount()}
          </span>
        </div>

        <div class={containerStyle}>
          <span>Draw:</span>
          <span class={drawCountStyle} data-testid="draw-pts-count">
            {drawCount()}
          </span>
        </div>
      </div>
    </div>
  )
}

const EndTurnButton = (): JSX.Element => {
  const handleOnClickEndTurn = (): void => {
    GameState.endTurn()
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
