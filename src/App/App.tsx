import { JSX } from "solid-js"

import { GameStartedState } from "@app/state"

import Game from "./Game"

const App = (): JSX.Element => {
  return (
    <div>{!GameStartedState.gameStarted() ? <LandingPage /> : <Game />}</div>
  )
}

const LandingPage = (): JSX.Element => {
  const handleOnClickStartGame = (): void => {
    GameStartedState.setGameStarted(true)
  }

  return (
    <div class="w-full h-full p-8 flex justify-start items-center flex-col">
      <div class="flex">
        <h1 class="text-4xl font-bold">Phalanx</h1>
      </div>

      <div class="flex-grow flex justify-center items-center w-full">
        <button
          data-testid="start-game-button"
          class="btn-rectangle btn-green-600"
          onClick={handleOnClickStartGame}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}

export default App
