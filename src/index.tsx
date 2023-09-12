import { createSignal, onCleanup } from "solid-js"
import { render } from "solid-js/web"
import html from "solid-js/html"

const App = () => {
  const [count, setCount] = createSignal<number>(0)

  const timer = setInterval(() => { setCount(count() + 1)}, 1000)
  onCleanup(() => clearInterval(timer))

  return html`<div>${count}</div>`
}

const mainElement = document.getElementById("main")

if (!(mainElement instanceof HTMLElement)) {
  throw new Error("Mounting element not found")
}

render(App, mainElement)
