import { render } from "solid-js/web"
import App from "./App"

const mainElement = document.getElementById("main")

if (!(mainElement instanceof HTMLElement)) {
  throw new Error("Mounting element not found")
}

render(App, mainElement)
