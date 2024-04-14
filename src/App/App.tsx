import { createSignal, JSX } from "solid-js"

import Game from "./Game"

const [gameStarted, setGameStarted] = createSignal<boolean>(false)

const App = (): JSX.Element => {
  return <div>{!gameStarted() ? <LandingPage /> : <Game />}</div>
}

const LandingPage = (): JSX.Element => {
  const handleOnClickStartGame = (): void => {
    setGameStarted(true)
  }
  return (
    <div class="w-full h-full p-8 flex justify-start items-center flex-col">
      <div class="flex">
        <h1 class="text-4xl font-bold">Zappalino</h1>
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
