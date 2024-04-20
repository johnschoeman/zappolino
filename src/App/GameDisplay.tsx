import { JSX } from "solid-js"
import { pipe } from "effect"

import { Player } from "@app/model"
import { GameState } from "@app/state"

const GameDisplay = (): JSX.Element => {
  const currentPlayer = (): string => {
    return pipe(GameState.game().currentPlayer, Player.toLabel)
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

  return (
    <div class="w-full border rounded flex flex-row justify-between p-2">
      <div class="text-center" data-testid="current-player">
        Player: {currentPlayer()}
      </div>
      <div class="text-center" data-testid="hegemony-white">
        Hegemony Sparta: {hegemonyWhite()}
      </div>
      <div class="text-center" data-testid="hegemony-black">
        Hegemony Athens: {hegemonyBlack()}
      </div>
      <div class="text-center" data-testid="turn-count">
        Turn: {turnCount()}
      </div>
    </div>
  )
}

export default GameDisplay
