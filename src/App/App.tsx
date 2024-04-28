import { JSX } from "solid-js"

import { GameState } from "@app/state"

import Game from "./Game"
import GameSetup from "./GameSetup"

const App = (): JSX.Element => {
  const isGameStarted = (): boolean => {
    return GameState.isGameStarted()
  }
  return <div>{!isGameStarted() ? <GameSetup /> : <Game />}</div>
}

export default App
