import { JSX } from "solid-js"

import { GameState } from "@app/state"

const GameDisplay = (): JSX.Element => {
  const currentPlayer = (): string => {
    return GameState.game().currentPlayer
  }
  const turnCount = (): number => {
    return GameState.game().turnCount
  }
  const hegemonyBlack = (): number => {
    return GameState.game().hegemonyBlack
  }
  const hegemonyWhite = (): number => {
    return GameState.game().hegemonyWhite
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
