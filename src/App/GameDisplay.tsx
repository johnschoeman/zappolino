import { JSX } from "solid-js"
import cn from "classnames"
import { pipe } from "effect"

import { Player } from "@app/model"
import { GameState } from "@app/state"

const GameDisplay = (): JSX.Element => {
  const currentPlayer = (): Player.Player => {
    return pipe(GameState.game().currentPlayer)
  }
  const currentPlayerText = (): string => {
    return pipe(currentPlayer(), Player.toLabel)
  }
  const turnCount = (): number => {
    return GameState.game().turnCount
  }
  const hegemonyBlack = (): number => {
    return GameState.game().hegemony.hegemonyBlack
  }
  const hegemonyWhite = (): number => {
    return GameState.game().hegemony.hegemonyWhite
  }

  const styleCurrentPlayer = (): string =>
    cn("info-display", {
      sparta: currentPlayer() === "White",
      athens: currentPlayer() === "Black",
    })

  const spartaHegemonyStyle = "sparta info-display"
  const athensHegemonyStyle = "athens info-display"

  const turnContainerStyle = "flex flex-row items-center space-x-2 p-2"
  const turnStyle = "point-display"

  return (
    <div class="w-full rounded flex flex-row items-center justify-between p-2">
      <div
        class="flex flex-row items-center space-x-2"
        data-testid="current-player"
      >
        <div>Player:</div>
        <div class={styleCurrentPlayer()}>{currentPlayerText()}</div>
      </div>
      <div class="flex flex-row items-center space-x-2">
        <div>Hegemony: </div>
        <div class={spartaHegemonyStyle} data-testid="hegemony-white">
          Sparta: {hegemonyWhite()}
        </div>
        <div class={athensHegemonyStyle} data-testid="hegemony-black">
          Athens: {hegemonyBlack()}
        </div>
      </div>

      <div class={turnContainerStyle} data-testid="turn-count">
        <span>Turn:</span>
        <span class={turnStyle}>{turnCount()}</span>
      </div>
    </div>
  )
}

export default GameDisplay
