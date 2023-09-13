import { createSignal, onCleanup } from "solid-js"

const App = () => {
  const [count, setCount] = createSignal<number>(0)

  const timer = setInterval(() => {
    setCount(count() + 1)
  }, 1000)
  onCleanup(() => clearInterval(timer))

  return (
    <div class="px-2">
      <h1 class="px-2">{count}</h1>
    </div>
  )
}

export default App
