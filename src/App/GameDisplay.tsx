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
    cn("text-center p-2 rounded items-center", {
      "bg-red-400": currentPlayer() === "White",
      "bg-blue-400": currentPlayer() === "Black",
    })

  return (
    <div class="w-full border rounded flex flex-row items-center justify-between p-2">
      <div
        class="flex flex-row items-center space-x-2"
        data-testid="current-player"
      >
        <div>Player:</div>
        <div class={styleCurrentPlayer()}>{currentPlayerText()}</div>
      </div>
      <div class="flex flex-row items-center space-x-2">
        <div>Hegemony: </div>
        <div
          class="text-center bg-red-400 p-2 rounded"
          data-testid="hegemony-white"
        >
          Sparta: {hegemonyWhite()}
        </div>
        <div
          class="text-center bg-blue-400 p-2 rounded"
          data-testid="hegemony-black"
        >
          Athens: {hegemonyBlack()}
        </div>
      </div>
      <div class="text-center" data-testid="turn-count">
        Turn: {turnCount()}
      </div>
    </div>
  )
}

export default GameDisplay
